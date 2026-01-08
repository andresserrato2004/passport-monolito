const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const visitRoutes = require('./routes/visitRoutes');
const placeRoutes = require('./routes/placeRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Esto permite todos los orígenes por defecto
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);          // /api/auth/register, /api/auth/login
app.use('/api/places', placeRoutes);       // /api/places (POST para registrar nuevos lugares)
app.use('/api/passport', visitRoutes);     // /api/passport (GET), /api/passport/visit (POST)

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// Manejar cualquier otra ruta devolviendo el index.html (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Para Vercel: exportar la app en lugar de usar app.listen directamente si no es el script principal
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
