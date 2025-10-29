import express from "express";
import dotenv from "dotenv";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentAssistantRoutes from "./routes/studentAssistantRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendances", attendanceRoutes);

app.use("/api/students", studentAssistantRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
