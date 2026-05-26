import { z } from 'zod'

export const InlineAnimationSchema = z.object({
  type: z.enum(['fade-in', 'slide-up', 'typewriter']),
  delay: z.number().nonnegative().optional(),
  duration: z.number().positive().optional(),
})

export const InlineNodeSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  code: z.boolean().optional(),
  color: z.string().optional(),
  bg: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
  font: z.enum(['display', 'body', 'mono']).optional(),
  link: z
    .object({
      href: z.string().url(),
      target: z.enum(['_blank', '_self']).optional(),
    })
    .optional(),
  animate: InlineAnimationSchema.optional(),
})

export const RichTextSchema = z.union([z.string(), z.array(InlineNodeSchema).min(1)])
