import { z } from 'zod'
import { RichTextSchema } from './rich-text.js'
import { BlockAnimationSchema } from './animation.js'

// ─── Display type enums ────────────────────────────────────────────────────

export const TextDisplaySchema = z.enum([
  'heading',
  'subheading',
  'body',
  'label',
  'caption',
  'quote',
  'eyebrow',
  'hero',
])

export const CodeDisplaySchema = z.enum(['block', 'inline', 'terminal'])

export const ListDisplaySchema = z.enum([
  'bullets',
  'numbered',
  'steps',
  'checklist',
  'timeline',
  'icon-row',
  'pill-row',
])

export const MediaDisplaySchema = z.enum(['image', 'video', 'icon', 'avatar', 'logo'])

export const MetricDisplaySchema = z.enum([
  'kpi',
  'stat-callout',
  'ring',
  'progress',
  'rating',
  'badge',
  'inline',
])

export const ChartDisplaySchema = z.enum(['minimal', 'filled', 'outlined', 'gradient'])

export const TableDisplaySchema = z.enum(['default', 'compact', 'striped', 'borderless'])

export const GroupDisplaySchema = z.enum([
  'columns',
  'cards',
  'comparison',
  'avatars',
  'icon-grid',
  'pricing',
])

export const CalloutDisplaySchema = z.enum([
  'info',
  'warning',
  'success',
  'danger',
  'neutral',
  'highlight',
])

export const DividerDisplaySchema = z.enum(['line', 'dots', 'space', 'gradient'])

// ─── Helper schemas ────────────────────────────────────────────────────────

const BlockIdSchema = z.string().optional()

export const ChartDatasetSchema = z.object({
  label: z.string().optional(),
  values: z.array(z.number()).min(1),
  color: z.string().optional(),
})

export const ChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(ChartDatasetSchema).min(1),
})

// Recursive list item: supports nested sublists
export interface ListItem {
  text: z.infer<typeof RichTextSchema>
  checked?: boolean
  icon?: string
  children?: ListItem[]
}

export const ListItemSchema: z.ZodType<ListItem> = z.lazy(() =>
  z.object({
    text: RichTextSchema,
    checked: z.boolean().optional(),
    icon: z.string().optional(),
    children: z.array(ListItemSchema).optional(),
  }),
)

// ─── Block type name enum ──────────────────────────────────────────────────

export const BUILT_IN_BLOCK_TYPES = [
  'text',
  'text-kinetic',
  'code',
  'list',
  'media',
  'metric',
  'chart',
  'table',
  'group',
  'callout',
  'divider',
] as const

export const BlockTypeSchema = z.enum(BUILT_IN_BLOCK_TYPES)

// ─── Non-recursive block schemas ──────────────────────────────────────────

export const TextBlockSchema = z.object({
  type: z.literal('text'),
  display: TextDisplaySchema.optional(),
  content: RichTextSchema,
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

// Freeform kinetic typography block — absolute-positioned via parent slot styles
export const KineticTextBlockSchema = z.object({
  type: z.literal('text-kinetic'),
  content: z.string(),
  fontSize: z.string().optional(),      // CSS value: 'clamp(80px,14vw,200px)'
  color: z.string().optional(),         // CSS color string
  fontFamily: z.string().optional(),    // CSS font-family override
  fontWeight: z.union([z.string(), z.number()]).optional(),
  letterSpacing: z.string().optional(), // CSS letter-spacing override
  ghost: z.boolean().optional(),        // renders at ~0.04 opacity as background decoration
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const CodeBlockSchema = z.object({
  type: z.literal('code'),
  display: CodeDisplaySchema.optional(),
  code: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
  highlight: z.array(z.number().int().positive()).optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const ListBlockSchema = z.object({
  type: z.literal('list'),
  display: ListDisplaySchema.optional(),
  items: z.array(ListItemSchema).min(1),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const MediaBlockSchema = z.object({
  type: z.literal('media'),
  display: MediaDisplaySchema.optional(),
  src: z.string(),
  alt: z.string().optional(),
  caption: RichTextSchema.optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const MetricBlockSchema = z.object({
  type: z.literal('metric'),
  display: MetricDisplaySchema.optional(),
  value: z.union([z.string(), z.number()]),
  label: RichTextSchema,
  delta: z.string().optional(),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const ChartBlockSchema = z.object({
  type: z.literal('chart'),
  display: ChartDisplaySchema.optional(),
  chartType: z.enum(['bar', 'line', 'pie', 'donut', 'scatter']),
  data: ChartDataSchema,
  title: z.string().optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const TableBlockSchema = z.object({
  type: z.literal('table'),
  display: TableDisplaySchema.optional(),
  headers: z.array(RichTextSchema).min(1),
  rows: z.array(z.array(RichTextSchema).min(1)).min(1),
  caption: z.string().optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const CalloutBlockSchema = z.object({
  type: z.literal('callout'),
  display: CalloutDisplaySchema.optional(),
  title: RichTextSchema.optional(),
  body: RichTextSchema,
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const DividerBlockSchema = z.object({
  type: z.literal('divider'),
  display: DividerDisplaySchema.optional(),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

export const XBlockSchema = z.object({
  type: z
    .custom<`x-${string}`>(
      (val) => typeof val === 'string' && /^x-[a-z][a-z0-9-]*$/.test(val),
      'Custom block type must match pattern x-{name}',
    ),
  props: z.record(z.string(), z.unknown()),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})

// ─── Non-group discriminated union (used inside GroupBlock) ───────────────

const NonGroupBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  KineticTextBlockSchema,
  CodeBlockSchema,
  ListBlockSchema,
  MediaBlockSchema,
  MetricBlockSchema,
  ChartBlockSchema,
  TableBlockSchema,
  CalloutBlockSchema,
  DividerBlockSchema,
])

// ─── Recursive Block union ─────────────────────────────────────────────────
// GroupBlock contains Block[], requiring z.lazy() to break the cycle.

export interface GroupBlock {
  type: 'group'
  display?: z.infer<typeof GroupDisplaySchema>
  blocks: Block[]
  id?: string
  animation?: z.infer<typeof BlockAnimationSchema>
}

export type KineticTextBlock = z.infer<typeof KineticTextBlockSchema>

export type Block =
  | z.infer<typeof NonGroupBlockSchema>
  | z.infer<typeof XBlockSchema>
  | GroupBlock

export const BlockSchema: z.ZodType<Block> = z.lazy(() =>
  z.union([
    NonGroupBlockSchema,
    XBlockSchema,
    z.object({
      type: z.literal('group'),
      display: GroupDisplaySchema.optional(),
      blocks: z.array(BlockSchema),
      id: BlockIdSchema,
      animation: BlockAnimationSchema.optional(),
    }),
  ]),
)

export const GroupBlockSchema = z.object({
  type: z.literal('group'),
  display: GroupDisplaySchema.optional(),
  blocks: z.array(BlockSchema),
  id: BlockIdSchema,
  animation: BlockAnimationSchema.optional(),
})
