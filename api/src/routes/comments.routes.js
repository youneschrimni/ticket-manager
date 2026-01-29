import { Router } from "express";
import prisma from "../prisma.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.use(auth);

async function getOwnedTicketOrThrow(ticketId, userId) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true },
  });

  if (!ticket) return { error: { status: 404, message: "Ticket not found" } };
  if (ticket.userId !== userId) return { error: { status: 403, message: "Forbidden" } };

  return { ticket };
}

router.post("/tickets/:id/comments", async (req, res) => {
  const ticketId = req.params.id;
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ message: "content is required" });
  }

  const { error } = await getOwnedTicketOrThrow(ticketId, req.user.id);
  if (error) return res.status(error.status).json({ message: error.message });

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      ticketId,
      userId: req.user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, email: true } },
    },
  });

  return res.status(201).json(comment);
});


router.get("/tickets/:id/comments", async (req, res) => {
  const ticketId = req.params.id;

  const { error } = await getOwnedTicketOrThrow(ticketId, req.user.id);
  if (error) return res.status(error.status).json({ message: error.message });

  const comments = await prisma.comment.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, email: true } },
    },
  });

  return res.json(comments);
});

export default router;
