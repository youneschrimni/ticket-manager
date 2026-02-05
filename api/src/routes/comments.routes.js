import { Router } from "express";
import prisma from "../prisma.js";
import auth from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(auth);

async function requireMembership(projectId, userId) {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  });
}

async function requireTicketInProject(ticketId, projectId) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, projectId: true },
  });
  if (!ticket || ticket.projectId !== projectId) return null;
  return ticket;
}

// CREATE comment
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, ticketId } = req.params;
    const content = (req.body.content || "").trim();

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ticket = await requireTicketInProject(ticketId, projectId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId,
        userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, email: true } },
      },
    });

    return res.status(201).json(comment);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// LIST comments
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, ticketId } = req.params;

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ticket = await requireTicketInProject(ticketId, projectId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

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
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// DELETE comment (author or project OWNER)
router.delete("/:commentId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, ticketId, commentId } = req.params;

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ticket = await requireTicketInProject(ticketId, projectId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, ticketId: true },
    });

    if (!comment || comment.ticketId !== ticketId) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = membership.role === "OWNER";
    const isAuthor = comment.userId === userId;

    if (!isOwner && !isAuthor) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

export default router;
