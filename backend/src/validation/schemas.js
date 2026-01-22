import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const articleCreateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1)
});

export const articleUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).optional()
}).refine(v => v.title !== undefined || v.body !== undefined, { message: "Nothing to update" });

export const roleUpdateSchema = z.object({
  role: z.enum(["admin","user"])
});
