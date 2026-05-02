# AmbuClear Server

AmbuClear is a real-time SOS and ambulance tracking application. This repository contains the Node.js backend server that powers the core location tracking, driver matching, and real-time communication between users and ambulance drivers.

## Features

- **Real-Time GPS Tracking**: Receives live GPS coordinates from users and drivers.
- **SOS Driver Matching**: When a user requests help, the system calculates the nearest available driver using the Haversine formula and connects them automatically.
- **WebSocket Communication**: Powered by `Socket.io` to ensure low-latency, real-time updates for location broadcasts, hospital selection, and status updates.
- **Cross-Platform Compatibility**: Configured with CORS to allow connections from mobile apps (e.g., Capacitor/Ionic) and web frontends.

## Tech Stack

- **Node.js**
- **Express**
- **Socket.io**

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kavink-io/AmbuClear-server-frontend.git
   cd AmbuClear-server-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the Node.js server:
```bash
npm start
```
The server will start on port `3000` by default (or the `PORT` environment variable).

## Socket Events

The server handles several WebSocket events for seamless communication:

- **`register`**: Registers a new user or driver and initializes their state.
- **`send-location`**: Receives and broadcasts live GPS updates.
- **`request-help`**: Triggered by a user to find and assign the nearest available driver.
- **`driver-available`**: Marks a driver as available for new requests.
- **`hospital-selected`**: Updates the hospital route for the user and driver.
- **`case-completed`**: Ends the active session between the user and driver.

## License

ISC
