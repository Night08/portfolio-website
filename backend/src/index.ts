import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db/dbConnect";
import AuthRouter from "./routes/auth";
import ProjectRouter from "./routes/project";
import SkillRouter from "./routes/Skill";
import ExperienceRouter from "./routes/Experience";
import emailRoutes from "./routes/emailRoutes";
import { Server } from "socket.io";
const http = require("http");

// config environment variables
dotenv.config();

// setup server
const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
// create socket server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to the client URL if different
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

// making connection to mongodb
app.use(async (req: Request, res: Response, next: NextFunction) => {
  await connectToMongo(res);
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected");
  // project operations
  socket.on("project-update", () => {
    // get events from frontend
    io.emit("project-update", "Project have been updated!"); // send events to frontend
  });

  socket.on("project-add", () => {
    io.emit("project-add", "Project have been added!");
  });
  socket.on("project-delete", () => {
    io.emit("project-delete", "Projects have been deleted!");
  });

  // experience operations
  socket.on("experience-update", () => {
    io.emit("experience-update", "Experience have been updated!");
  });

  socket.on("experience-add", () => {
    io.emit("experience-add", "Experience have been added!");
  });
  socket.on("experience-delete", () => {
    io.emit("experience-delete", "Experience have been deleted!");
  });

  // skills operations
  socket.on("skills-update", () => {
    io.emit("skills-update", "Skills have been updated!");
  });

  socket.on("skills-add", () => {
    io.emit("skills-add", "Skills have been added!");
  });
  socket.on("skills-delete", () => {
    io.emit("project-delete", "Skills have been deleted!");
  });

  // request operations
  socket.on("collaboration-request", () => {
    io.emit("collaboration-request", "A collaboration request has been made!");
  });

  // profile update operations
  socket.on("profile-update", () => {
    io.emit("profile-update", "Profile have been updated!");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/skills", SkillRouter);
app.use("/api/experiences", ExperienceRouter);
app.use("/api/emails", emailRoutes);

// routes
app.get("/", (req: Request, res: Response) => {
  console.log(process.env.JWT_SECRET_KEY)
  res.send("Portfolio Backend Working Properly!!");
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
