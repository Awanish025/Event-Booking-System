# Smart Event Booking System

A full-stack event booking application built with the MERN stack (MySQL, Express, React, Node.js).

## Features

- **User:**
  - Browse upcoming events with search and filter.
  - View event details and location.
  - Real-time seat availability updates.
  - Book tickets and receive a QR code confirmation.
  - Animated UI with Framer Motion.

- **Admin:**
  - Create new events.
  - Delete events.
  - View all events in a dashboard.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios
- **Backend:** Node.js, Express, Socket.IO, Multer
- **Database:** MySQL

## Quick Start

The project includes a root script to run both client and server concurrently.

1. **Install dependencies** in root, client, and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
2. **Setup Database** and **Environment Variables** (see detailed instructions below).
3. **Run the app**:
   ```bash
   # From the root directory
   npm start
   ```

## Detailed Setup Instructions

### Prerequisites
- Node.js installed.
- MySQL Server installed and running.

### 1. Database Setup
1. Open your MySQL client (Workbench, CLI, etc.).
2. Run the script located at `database/schema.sql` to create the database and tables:
   ```sql
   source database/schema.sql;
   ```
   Or copy-paste the contents of `database/schema.sql` into your query window and execute.

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file in the `server` directory with your DB credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=event_booking
   PORT=5000
   ```
   > **Note:** Replace `your_password` with your actual MySQL root password.

3. (Optional) Run backend separately:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. (Optional) Run frontend separately:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## API Endpoints

- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (Admin)
- `DELETE /events/:id` - Delete event (Admin)
- `POST /bookings` - Book tickets

## Real-time Features
The application uses Socket.IO to update seat availability in real-time across all connected clients when a booking is made.
