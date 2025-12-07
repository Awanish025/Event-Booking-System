const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', eventController.getAllEvents);
router.get('/locations', eventController.getLocations);
router.get('/:id', eventController.getEventById);
router.post('/', upload.single('img'), eventController.createEvent);
router.put('/:id', upload.single('img'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
