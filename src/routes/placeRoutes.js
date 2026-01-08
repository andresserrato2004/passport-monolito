const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const auth = require('../middleware/authMiddleware');

// (opcionalmente, restringido solo para ti)
router.post('/', auth, placeController.createPlace);

router.get('/', auth, placeController.createPlace);

module.exports = router;
