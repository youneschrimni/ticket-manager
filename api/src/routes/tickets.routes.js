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

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const {assigneeId} = req.user.id;
    const { title, description, priority, type } = req.body;

    if (!projectId) return res.status(400).json({ message: "projectId missing in route" });

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (assigneeId) {
      const assigneeMembership = await requireMembership(projectId, assigneeId);
      if (!assigneeMembership) {
        return res.status(400).json({ message: "assignee must be a project member" });
      }
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        priority: priority || "MEDIUM",
        type: type || "REQUEST",
        projectId,
        reporterId: userId,
        assigneeId: assigneeId || null,
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
        projectId: true,
        reporterId: true,
        assigneeId: true,
      },
    });

    return res.status(201).json(ticket);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// LIST tickets in a project (must be member)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tickets = await prisma.ticket.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        reporterId: true,
        assigneeId: true,
        description: true
      },
    });

    return res.json(tickets);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// GET one ticket (must be member of project)
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, id } = req.params;

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        reporterId: true,
        assigneeId: true,
      },
    });

    if (!ticket || ticket.projectId !== projectId) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json(ticket);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// PATCH ticket
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, id } = req.params;
    const { title, description, status, priority, type, assigneeId } = req.body;

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { id: true, projectId: true, reporterId: true, assigneeId: true },
    });

    if (!ticket || ticket.projectId !== projectId) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isOwner = membership.role === "OWNER";
    const isReporter = ticket.reporterId === userId;
    const isAssignee = ticket.assigneeId === userId;

    // Règle simple: owner/reporter/assignee peuvent modifier
    if (!isOwner && !isReporter && !isAssignee) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Si on change l'assignee, on limite à owner ou reporter
    if (assigneeId !== undefined) {
      if (!isOwner && !isReporter) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (assigneeId !== null) {
        const assigneeMembership = await requireMembership(projectId, assigneeId);
        if (!assigneeMembership) {
          return res.status(400).json({ message: "assignee must be a project member" });
        }
      }
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title: String(title).trim() } : {}),
        ...(description !== undefined ? { description: String(description).trim() } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(assigneeId !== undefined ? { assigneeId } : {}),
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
        projectId: true,
        reporterId: true,
        assigneeId: true,
      },
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// DELETE ticket (owner or reporter)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { id: true, projectId: true, reporterId: true },
    });

    if (!ticket || ticket.projectId !== projectId) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const membership = await requireMembership(projectId, userId);
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const isOwner = membership.role === "OWNER";
    const isReporter = ticket.reporterId === userId;

    if (!isOwner && !isReporter) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.ticket.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

export default router;
