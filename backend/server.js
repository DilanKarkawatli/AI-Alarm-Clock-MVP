import dotenv from "dotenv";
import express from "express";
import alarmRoutes from "./routes/alarmRoutes.js";
dotenv.config();

// Create an instance of the Express application
const app = express();

// Enables the app to read JSON data from the request body
app.use(express.json());
// Register routes
app.use("/", alarmRoutes);

app.get("/", (req, res) => {
	res.send("Server running");
});

// Start the server and listen on port 3000
app.listen(3000, () => {
	  console.log("Server is running on port 3000");
});