import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? "/var/www/ticket-manager/shared/.env"
      : ".env",
});

import express from "express";
import cors from "cors";

import auth from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);

app.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.use("/projects", projectRoutes);

app.use("/projects/:projectId/tickets", ticketRoutes);

app.use("/projects/:projectId/tickets/:ticketId/comments", commentsRoutes);

app.use("/members", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
