import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                            <Calendar className="w-8 h-8" />
                            <span>EventFlow</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/events" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                            Explore Events
                        </Link>
                        <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium transition">
                            <User className="w-5 h-5" />
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
