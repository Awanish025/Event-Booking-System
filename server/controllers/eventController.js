const db = require('../config/db');

// Get all events with optional search and filters
exports.getAllEvents = (req, res) => {
    const { search, location, date } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1'; // Start with a base query
    const params = [];

    // Add search filter (title or description)
    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // Add location filter
    if (location) {
        query += ' AND location LIKE ?';
        params.push(`%${location}%`);
    }

    // Add date filter
    if (date) {
        query += ' AND DATE(date) = ?';
        params.push(date);
    }

    query += ' ORDER BY date ASC'; // Sort by date

    db.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(results);
    });
};

// Get all unique locations for the filter dropdown
exports.getLocations = (req, res) => {
    db.query('SELECT DISTINCT location FROM events', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        // Extract location strings from result objects
        const locations = results.map(row => row.location).filter(loc => loc);
        res.json(locations);
    });
};

// Get single event by ID
exports.getEventById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM events WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(results[0]);
    });
};

// Create new event (Admin only)
exports.createEvent = (req, res) => {
    const { title, description, location, date, total_seats, price } = req.body;
    const available_seats = total_seats; // Initially, available seats = total seats

    // Handle image upload
    let img = '';
    if (req.file) {
        // Construct URL for uploaded file
        img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.img) {
        img = req.body.img;
    }

    const query = 'INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [title, description, location, date, total_seats, available_seats, price, img], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating event' });
        }
        res.status(201).json({ message: 'Event created successfully', id: result.insertId });
    });
};

// Update event (Admin only)
exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { title, description, location, date, total_seats, price } = req.body;

    let imgUpdate = '';
    let params = [title, description, location, date, total_seats, price];

    // Handle image update if a new file is uploaded
    if (req.file) {
        const img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        imgUpdate = ', img=?';
        params.push(img);
    } else if (req.body.img) {
        imgUpdate = ', img=?';
        params.push(req.body.img);
    }

    params.push(id);

    const query = `UPDATE events SET title=?, description=?, location=?, date=?, total_seats=?, price=?${imgUpdate} WHERE id=?`;

    db.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating event' });
        }
        res.json({ message: 'Event updated successfully' });
    });
};

// Delete event (Admin only)
exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM events WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting event' });
        }
        res.json({ message: 'Event deleted successfully' });
    });
};
