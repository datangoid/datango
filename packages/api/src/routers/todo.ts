import { todo } from "@datango/db/schema/todo";
import { eq } from "drizzle-orm";
import z from "zod";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async ({ context }) => context.db.select().from(todo)),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input, context }) =>
      context.db.insert(todo).values({
        text: input.text,
      })
    ),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input, context }) =>
      context.db.update(todo).set({ completed: input.completed }).where(eq(todo.id, input.id))
    ),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input, context }) => context.db.delete(todo).where(eq(todo.id, input.id))),
};
