const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta existente para obtener lugares visitados
router.get('/', authMiddleware, visitController.getVisitedPlaces);

// Ruta existente para registrar visita
router.post('/visit', authMiddleware, visitController.registerVisit);

// Nueva ruta para obtener lugares disponibles (descripción "yes")
router.get('/available', authMiddleware, visitController.getAvailablePlaces);

// Nueva ruta para obtener lugares con estado de visita
router.get('/status', authMiddleware, visitController.getPlacesWithVisitStatus);

module.exports = router;