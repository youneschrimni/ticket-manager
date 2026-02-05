import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import prisma from "../prisma.js";

const router = Router({ mergeParams: true });

router.use(auth);

router.get("/:projectId", async (req, res)=>{
    const userId = req.user.id;
    const { projectId } = req.params;

    const isMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
        select: {role : true}
    })

    if (!isMember) res.status(403).json({ message: "Forbidden" });

    const members = await prisma.projectMember.findMany({
        where: {projectId: projectId},
        select: {
            user: true,
            project: true
        }
    })

    return res.status(200).json(members);
})

export default router;
