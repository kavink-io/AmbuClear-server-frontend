# AmbuClear Server

## Description

AmbuClear is a life-saving, real-time SOS and ambulance tracking application designed to drastically reduce emergency response times. By instantly bridging the gap between individuals in distress and the nearest available ambulance drivers, AmbuClear ensures that critical medical help arrives when every second counts. 

This repository houses the **Node.js WebSocket backend** that acts as the central nerve center for the platform. It handles continuous GPS location tracking, executes an intelligent driver-matching algorithm using the Haversine formula to pinpoint the closest responder, and maintains persistent, low-latency connections between users and drivers throughout the emergency response process.

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
