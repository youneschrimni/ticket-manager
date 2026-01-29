import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import commentsRoutes from "./routes/comments.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

app.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.use("/tickets", ticketRoutes);

app.use(commentsRoutes);
