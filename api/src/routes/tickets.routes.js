import { Router } from "express";
import prisma from "../prisma.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.use(auth);

router.post("/", async (req, res) => {

    const { title, description, priority, type } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: "title and description are required" });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      priority: priority || "MEDIUM",
      type: type || "REQUEST",
      userId: req.user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(201).json(ticket);
});

router.get("/", async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(tickets);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return res.json({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    type: ticket.type,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, type } = req.body;

  const existing = await prisma.ticket.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updated = await prisma.ticket.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(type !== undefined ? { type } : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.ticket.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.ticket.delete({ where: { id } });

  return res.status(204).send();
});


export default router;
