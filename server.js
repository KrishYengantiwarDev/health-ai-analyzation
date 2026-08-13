require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const assessmentRoutes = require("./src/routes/assessmentRoutes");
// const languageRoutes = require("./src/routes/languageRoutes");
const medicineRoutes = require("./src/routes/medicineRoutes");
const awarenessRoutes = require("./src/routes/awarenessRoutes");

const errorHandler = require("./src/middleware/errorHandler");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/assessment", assessmentRoutes);
// app.use("/api/language", languageRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/awareness", awarenessRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Health AI Backend Running"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler (Always Last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running On Port ${PORT}`);
});