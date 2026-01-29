import { z } from "zod";

const TicketStatus = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const TicketPriority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const TicketType = z.enum(["BUG", "REQUEST"]);

export const ticketCreateSchema = z.object({
  title: z.string().min(1, "title requis"),
  description: z.string().min(1, "description requis"),
  priority: TicketPriority.optional(),
  type: TicketType.optional(),
});

export const ticketPatchSchema = z
  .object({
    title: z.string().min(1, "title invalide").optional(),
    description: z.string().min(1, "description invalide").optional(),
    status: TicketStatus.optional(),
    priority: TicketPriority.optional(),
    type: TicketType.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
    path: [],
  });
