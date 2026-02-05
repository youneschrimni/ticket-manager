import { Router } from "express";
import prisma from "../prisma.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.use(auth);

// CREATE project (creator = owner + membership OWNER)
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const name = (req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: { name, ownerId: userId },
        select: {
          id: true,
          name: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.projectMember.create({
        data: {
          projectId: created.id,
          userId,
          role: "OWNER",
        },
      });

      return created;
    });

    return res.status(201).json({
      ...project,
      myRole: "OWNER",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// GET my projects (member or owner)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const projects = memberships.map((m) => ({
      ...m.project,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));

    return res.json(projects);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// GET one project (must be member)
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });

    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            role: true,
            joinedAt: true,
            user: { select: { id: true, email: true } },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ ...project, myRole: membership.role });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// DELETE project (only OWNER)
router.delete("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });

    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (membership.role !== "OWNER") {
      return res.status(403).json({ message: "Forbidden",member: membership });
    }

    await prisma.project.delete({ where: { id: projectId } });
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "internal error" });
  }
});

export default router;
