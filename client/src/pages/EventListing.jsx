import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search } from 'lucide-react';

const EventListing = () => {
    // State for storing events and filter criteria
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [locations, setLocations] = useState([]); // Dynamic locations for dropdown
    const [loading, setLoading] = useState(true);

    // Fetch unique locations on component mount
    useEffect(() => {
        fetchLocations();
    }, []);

    // Fetch events whenever search, location, or date filters change
    useEffect(() => {
        fetchEvents();
    }, [search, location, date]);

    // Function to fetch unique locations from backend
    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/events/locations`);
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    // Function to fetch events based on current filters
    const fetchEvents = async () => {
        try {
            const params = {};
            // Add filters to query parameters if they exist
            if (search) params.search = search;
            if (location) params.location = location;
            if (date) params.date = date;

            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/events`, { params });
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header and Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    {/* Location Dropdown */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {locations.map((loc, index) => (
                            <option key={index} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="text-center py-20">Loading events...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    {events.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No events found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Reusable Event Card Component with Hover Animation
const EventCard = ({ event }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
    >
        <div className="h-48 bg-gray-200 relative overflow-hidden">
            <img
                src={event.img || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt={event.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-indigo-600 shadow-sm">
                ${event.price}
            </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

            <div className="mt-auto space-y-2">
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${event.available_seats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {event.available_seats > 0 ? `${event.available_seats} seats left` : 'Sold Out'}
                    </span>
                    <Link
                        to={`/events/${event.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    </motion.div>
);

export default EventListing;
