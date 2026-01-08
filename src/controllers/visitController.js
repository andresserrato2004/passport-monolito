const prisma = require('../models/db');

exports.registerVisit = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;

  try {
    const place = await prisma.place.findUnique({ where: { code } });
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });

    await prisma.userPlace.upsert({
      where: {
        userId_placeId: {
          userId,
          placeId: place.id
        }
      },
      update: {},
      create: {
        userId,
        placeId: place.id
      }
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error registrando visita' });
  }
};


exports.getVisitedPlaces = async (req, res) => {
  const userId = req.user.userId;
  try {
    const visits = await prisma.userPlace.findMany({
      where: { userId },
      include: {
        place: {
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            websiteUrl: true,
            imageUrl: true,
            createdAt: true
          }
        }
      }
    });

    const places = visits.map(v => v.place);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo lugares' });
  }
};


exports.getAvailablePlaces = async (req, res) => {
  try {
    const places = await prisma.place.findMany({
      where: {
        description: "yes"
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        websiteUrl: true,
        imageUrl: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo lugares disponibles' });
  }
};

// ...existing code...

exports.getPlacesWithVisitStatus = async (req, res) => {
  const userId = req.user.userId;
  
  try {
    // Obtener todos los lugares con descripción "yes"
    const availablePlaces = await prisma.place.findMany({
      where: {
        description: "yes"
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        websiteUrl: true,
        imageUrl: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Obtener lugares visitados por el usuario
    const visitedPlaces = await prisma.userPlace.findMany({
      where: { userId },
      select: {
        placeId: true,
        visitedAt: true
      }
    });

    // Crear un Set para búsqueda rápida de lugares visitados
    const visitedPlaceIds = new Set(visitedPlaces.map(v => v.placeId));
    const visitedDates = visitedPlaces.reduce((acc, v) => {
      acc[v.placeId] = v.visitedAt;
      return acc;
    }, {});

    // Combinar información
    const placesWithStatus = availablePlaces.map(place => ({
      ...place,
      isVisited: visitedPlaceIds.has(place.id),
      visitedAt: visitedDates[place.id] || null
    }));

    res.json(placesWithStatus);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo lugares con estado de visita' });
  }
};
