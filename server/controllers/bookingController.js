const db = require('../config/db');

// Create a new booking with transaction support
exports.createBooking = (req, res) => {
    const { event_id, name, email, mobile, quantity } = req.body;

    // Start a database transaction to ensure data integrity
    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: 'Transaction error' });
            }

            // Step 1: Check seat availability and lock the row (FOR UPDATE)
            // This prevents race conditions where multiple users try to book the last seat simultaneously
            connection.query('SELECT available_seats, price FROM events WHERE id = ? FOR UPDATE', [event_id], (err, results) => {
                if (err || results.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ message: 'Event not found' });
                    });
                }

                const event = results[0];
                // Check if enough seats are available
                if (event.available_seats < quantity) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(400).json({ message: 'Not enough seats available' });
                    });
                }

                const total_amount = event.price * quantity;

                // Step 2: Insert booking record
                const bookingQuery = 'INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount) VALUES (?, ?, ?, ?, ?, ?)';
                connection.query(bookingQuery, [event_id, name, email, mobile, quantity, total_amount], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: 'Error creating booking' });
                        });
                    }

                    // Step 3: Update available seats count
                    const updateSeatsQuery = 'UPDATE events SET available_seats = available_seats - ? WHERE id = ?';
                    connection.query(updateSeatsQuery, [quantity, event_id], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ message: 'Error updating seats' });
                            });
                        }

                        // Step 4: Commit the transaction
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: 'Commit error' });
                                });
                            }

                            // Step 5: Emit real-time update via Socket.IO
                            // This notifies all connected clients (frontend) to update their seat count immediately
                            const io = req.app.get('io');
                            io.emit('seatUpdate', { event_id, available_seats: event.available_seats - quantity });

                            connection.release();
                            res.status(201).json({ message: 'Booking confirmed', bookingId: result.insertId });
                        });
                    });
                });
            });
        });
    });
};
