import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home } from 'lucide-react';

const BookingSuccess = () => {
    const location = useLocation();
    const { booking, event, bookingData } = location.state || {};

    if (!booking) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">No booking information found.</p>
                <Link to="/" className="text-indigo-600 font-medium hover:underline">Return Home</Link>
            </div>
        );
    }

    const qrValue = JSON.stringify({
        bookingId: booking.bookingId,
        eventId: event.id,
        name: bookingData.name,
        quantity: bookingData.quantity
    });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-green-500 p-6 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4"
                    >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
                    <p className="text-green-100 mt-1">Your tickets are ready.</p>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-gray-500">{new Date(event.date).toLocaleString()}</p>
                        <p className="text-gray-500">{event.location}</p>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                            <QRCodeCanvas value={qrValue} size={180} />
                        </div>
                    </div>

                    <div className="space-y-3 mb-8 text-sm">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Booking ID</span>
                            <span className="font-mono font-medium">{booking.bookingId}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Name</span>
                            <span className="font-medium">{bookingData.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Quantity</span>
                            <span className="font-medium">{bookingData.quantity} Tickets</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Total Paid</span>
                            <span className="font-bold text-indigo-600">${(event.price * bookingData.quantity).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download Ticket
                        </button>
                        <Link
                            to="/"
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
