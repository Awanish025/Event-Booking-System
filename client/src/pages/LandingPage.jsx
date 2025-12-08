import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Star, Users, Ticket, Heart, Mail } from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);

    // Fetch featured events on component mount
    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/events`);
                // Display top 3 events as featured
                setFeaturedEvents(response.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchFeaturedEvents();
    }, []);

    // Animation variants for container (staggered children)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    // Animation variants for individual items
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section: Main introduction with animated background */}
            <section className="relative bg-indigo-900 text-white py-20 lg:py-32 overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"
                ></motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-indigo-900"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
                >
                    <motion.div variants={itemVariants}>
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm">
                            The Future of Event Booking
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
                    >
                        Discover & Book <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                            Unforgettable Events
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed"
                    >
                        From electric concerts to inspiring conferences, find the perfect event for you.
                        Seamless booking, instant confirmation, and memories that last a lifetime.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link
                            to="/events"
                            className="group relative inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full overflow-hidden shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                            <span className="relative flex items-center">
                                Explore Events <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section: Display key metrics */}
            <section className="py-10 bg-indigo-900 border-t border-indigo-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatCounter icon={<Users className="w-6 h-6" />} value="50K+" label="Active Users" />
                        <StatCounter icon={<Calendar className="w-6 h-6" />} value="1000+" label="Events Hosted" />
                        <StatCounter icon={<Ticket className="w-6 h-6" />} value="100K+" label="Tickets Sold" />
                        <StatCounter icon={<Heart className="w-6 h-6" />} value="4.9/5" label="User Rating" />
                    </div>
                </div>
            </section>

            {/* Featured Events Section: Show top 3 events */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
                        <p className="text-gray-600">Don't miss out on these trending experiences.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredEvents.map(event => (
                            <Link key={event.id} to={`/events/${event.id}`} className="group">
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden h-full border border-gray-100"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={event.img || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-indigo-600">
                                            ${event.price}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {event.location}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/events" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-700">
                            View All Events <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section: Why choose us */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EventFlow?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We make booking simple so you can focus on enjoying the experience.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MapPin className="w-8 h-8 text-indigo-600" />}
                            title="Prime Locations"
                            description="Events in the most accessible and stunning venues across the city."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-pink-500" />}
                            title="Easy Booking"
                            description="Book your tickets in seconds with our streamlined checkout process."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Star className="w-8 h-8 text-yellow-500" />}
                            title="Instant Access"
                            description="Receive your QR code ticket immediately after payment."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section: User reviews */}
            <section className="py-20 bg-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Johnson"
                            role="Music Lover"
                            quote="The booking process was incredibly smooth. I got my tickets instantly!"
                            delay={0}
                        />
                        <TestimonialCard
                            name="Michael Chen"
                            role="Event Organizer"
                            quote="EventFlow made managing my conference attendees a breeze. Highly recommended."
                            delay={0.2}
                        />
                        <TestimonialCard
                            name="Emily Davis"
                            role="Frequent Goer"
                            quote="I love the real-time seat updates. No more guessing if tickets are available."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Newsletter Section: Email signup */}
            <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 relative text-center">
                    <Mail className="w-12 h-12 mx-auto mb-6 text-indigo-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-indigo-200 mb-8 text-lg">Subscribe to our newsletter for exclusive offers and early access to top events.</p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1"
                        />
                        <button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-full transition shadow-lg">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -10, transition: { duration: 0.2 } }}
        className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300"
    >
        <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

// Reusable Stat Counter Component
const StatCounter = ({ icon, value, label }) => (
    <div className="flex flex-col items-center">
        <div className="text-indigo-400 mb-2">{icon}</div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-indigo-200 text-sm">{label}</div>
    </div>
);

// Reusable Testimonial Card Component
const TestimonialCard = ({ name, role, quote, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-8 rounded-2xl shadow-md border border-gray-100"
    >
        <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                {name[0]}
            </div>
            <div>
                <h4 className="font-bold text-gray-900">{name}</h4>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
        <p className="text-gray-600 italic">"{quote}"</p>
    </motion.div>
);

export default LandingPage;
