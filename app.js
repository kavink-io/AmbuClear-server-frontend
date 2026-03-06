const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);

// CAPACITOR FIX: Enable CORS so the mobile app can connect
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const clients = {}; 

// Math formula to calculate real-world distance between two GPS coordinates
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

io.on("connection", function(socket) {
    console.log("🟢 New connection established. Socket ID:", socket.id);

    // Register User or Driver
    socket.on("register", (data) => {
        clients[socket.id] = {
            id: socket.id,
            role: data.role,
            latitude: null,
            longitude: null,
            isAvailable: true,
            vehicleNumber: data.role === 'driver' ? `TN-${Math.floor(Math.random()*90 + 10)}-${Math.floor(Math.random()*9000 + 1000)}` : null
        };
        console.log(`👤 Registered: ${data.role.toUpperCase()} (ID: ${socket.id})`);
    });

    // Receive live GPS and broadcast it
    socket.on("send-location", function(data) {
        if (clients[socket.id]) {
            clients[socket.id].latitude = data.latitude;
            clients[socket.id].longitude = data.longitude;
            if (clients[socket.id].role === 'driver') {
                io.emit("driver-location-update", { id: socket.id, ...data });
            }
        }
    });

    // Handle SOS Request
    socket.on("request-help", function(userLocation) {
        console.log(`🚨 SOS Request from User: ${socket.id}`);
        
        let closestDriverId = null;
        let minDistance = Infinity;

        // Find the nearest available driver with a locked GPS signal
        for (const id in clients) {
            const client = clients[id];
            if (client.role === 'driver' && client.isAvailable && client.latitude && client.longitude) {
                const distance = getDistanceFromLatLonInMeters(
                    userLocation.latitude, userLocation.longitude,
                    client.latitude, client.longitude
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDriverId = id;
                }
            }
        }

        // Connect them if a driver is found
        if (closestDriverId) {
            console.log(`✅ Driver Found! Assigning to Driver ID: ${closestDriverId}`);
            clients[closestDriverId].isAvailable = false; // Lock the driver
            
            // Tell the Driver
            io.to(closestDriverId).emit("help-assigned", {
                userId: socket.id,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                distance: Math.round(minDistance)
            });
            
            // Tell the User
            socket.emit("driver-en-route", { 
                driverId: closestDriverId,
                driverLat: clients[closestDriverId].latitude,
                driverLng: clients[closestDriverId].longitude,
                vehicleNumber: clients[closestDriverId].vehicleNumber
            });
        } else {
            console.log("❌ Failed: No available drivers found with a locked GPS location.");
            socket.emit("help-status", { status: "⚠️ All drivers are busy. Please wait." });
        }
    });

    // Free up driver after task
    socket.on("driver-available", function() {
        if (clients[socket.id]) {
            clients[socket.id].isAvailable = true;
            console.log(`🚑 Driver ${socket.id} is now AVAILABLE.`);
        }
    });

    // UI Updates
    socket.on("update-user-status", function(data) {
        io.to(data.userId).emit("help-status", { status: data.message });
    });

    socket.on("hospital-selected", function(data) {
        io.to(data.userId).emit("hospital-route", data); 
    });

    socket.on("case-completed", function(data) {
        io.to(data.userId).emit("case-completed");
        console.log(`🏁 Case completed between Driver and User.`);
    });

    // Handle Drops
    socket.on("disconnect", function() {
        console.log("🔴 Disconnected:", socket.id);
        if (clients[socket.id]) {
            if (clients[socket.id].role === 'driver') {
                io.emit("driver-disconnected", socket.id);
            }
            delete clients[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Node server running on port ${PORT}`));
