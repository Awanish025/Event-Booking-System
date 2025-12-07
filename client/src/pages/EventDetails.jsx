import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, CreditCard } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        mobile: '',
        quantity: 1
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent();

        // Initialize Socket.IO connection for real-time updates
        const socket = io('http://localhost:5000');

        // Listen for 'seatUpdate' event from server
        socket.on('seatUpdate', (data) => {
            // Update available seats if the update is for the current event
            if (data.event_id === parseInt(id)) {
                setEvent(prev => prev ? { ...prev, available_seats: data.available_seats } : null);
            }
        });

        // Cleanup socket connection on component unmount
        return () => socket.disconnect();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/events/${id}`);
            setEvent(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching event:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Send booking request to backend
            const response = await axios.post('http://localhost:5000/bookings', {
                event_id: id,
                ...bookingData
            });
            // Navigate to success page with booking details
            navigate('/success', { state: { booking: response.data, event, bookingData } });
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!event) return <div className="text-center py-20">Event not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Event Information Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <img
                        src={event.img || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={event.title}
                        className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8"
                    />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                            {event.location}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {event.description}
                    </p>

                    {/* Map Placeholder */}
                    <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400 border border-gray-200">
                        <div className="text-center">
                            <MapPin className="w-10 h-10 mx-auto mb-2" />
                            <p>Map Integration Placeholder</p>
                        </div>
                    </div>
                </motion.div>

                {/* Booking Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-24"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>

                    {/* Price and Availability Summary */}
                    <div className="flex justify-between items-center mb-6 p-4 bg-indigo-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">Price per ticket</p>
                            <p className="text-2xl font-bold text-indigo-600">${event.price}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Available Seats</p>
                            <p className={`text-xl font-bold ${event.available_seats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {event.available_seats}
                            </p>
                        </div>
                    </div>

                    {event.available_seats > 0 ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={bookingData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={bookingData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={bookingData.mobile}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    max={Math.min(10, event.available_seats)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={bookingData.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${(event.price * bookingData.quantity).toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {submitting ? 'Processing...' : (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Confirm Booking
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8 bg-red-50 rounded-lg text-red-600 font-medium">
                            This event is currently sold out.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
