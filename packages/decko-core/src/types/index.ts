import type { z } from 'zod'
import type {
  AnimatablePropsSchema,
  BaseAnimationSchema,
  BlockAnimationSchema,
} from '../schemas/animation.js'
import type {
  InlineAnimationSchema,
  InlineNodeSchema,
  RichTextSchema,
} from '../schemas/rich-text.js'
import type { CompositionSchema } from '../schemas/composition.js'
import type {
  SlideTransitionSchema,
  CutTransitionSchema,
  FadeTransitionSchema,
  ZoomThroughTransitionSchema,
  ZoomOutTransitionSchema,
  PanTransitionSchema,
  MorphTransitionSchema,
  ParticleBurstTransitionSchema,
  WipeTransitionSchema,
} from '../schemas/transition.js'
import type {
  BlockTypeSchema,
  TextBlockSchema,
  KineticTextBlockSchema,
  CodeBlockSchema,
  ListBlockSchema,
  MediaBlockSchema,
  MetricBlockSchema,
  ChartBlockSchema,
  TableBlockSchema,
  GroupBlockSchema,
  CalloutBlockSchema,
  DividerBlockSchema,
  XBlockSchema,
  ChartDataSchema,
  ChartDatasetSchema,
  TextDisplaySchema,
  CodeDisplaySchema,
  ListDisplaySchema,
  MediaDisplaySchema,
  MetricDisplaySchema,
  ChartDisplaySchema,
  TableDisplaySchema,
  GroupDisplaySchema,
  CalloutDisplaySchema,
  DividerDisplaySchema,
} from '../schemas/blocks.js'
import type { Block, GroupBlock, KineticTextBlock, ListItem } from '../schemas/blocks.js'
import type {
  TemplateCategorySchema,
  LayoutModeSchema,
  ContentBudgetSchema,
  TemplateSlotSchema,
  TemplateDefinitionSchema,
} from '../schemas/template.js'
import type {
  ThemeTokensSchema,
  ThemeDefinitionSchema,
  ThemePersonalitySchema,
  MotionIntensitySchema,
} from '../schemas/theme.js'
import type {
  SlideSchema,
  SlideBackgroundSchema,
  SlideAmbientSchema,
  SlideSlotsSchema,
  SlotStyleSchema,
} from '../schemas/slide.js'
import type {
  DeckSchema,
  DeckMetaSchema,
  DeckThemeSchema,
  AspectRatioSchema,
} from '../schemas/deck.js'
import type {
  GenerationEventSchema,
  StartEventSchema,
  OutlineEventSchema,
  SlideStartEventSchema,
  SlideCompleteEventSchema,
  DoneEventSchema,
  ErrorEventSchema,
  OutlineSlideSchema,
} from '../schemas/generation.js'

// ─── Rich Text ─────────────────────────────────────────────────────────────
export type InlineAnimation = z.infer<typeof InlineAnimationSchema>
export type InlineNode = z.infer<typeof InlineNodeSchema>
export type RichText = z.infer<typeof RichTextSchema>

// ─── Composition ───────────────────────────────────────────────────────────
export type Composition = z.infer<typeof CompositionSchema>

// ─── Transitions ───────────────────────────────────────────────────────────
export type SlideTransition = z.infer<typeof SlideTransitionSchema>
export type CutTransition = z.infer<typeof CutTransitionSchema>
export type FadeTransition = z.infer<typeof FadeTransitionSchema>
export type ZoomThroughTransition = z.infer<typeof ZoomThroughTransitionSchema>
export type ZoomOutTransition = z.infer<typeof ZoomOutTransitionSchema>
export type PanTransition = z.infer<typeof PanTransitionSchema>
export type MorphTransition = z.infer<typeof MorphTransitionSchema>
export type ParticleBurstTransition = z.infer<typeof ParticleBurstTransitionSchema>
export type WipeTransition = z.infer<typeof WipeTransitionSchema>

// ─── Block display variants ────────────────────────────────────────────────
export type TextDisplay = z.infer<typeof TextDisplaySchema>
export type CodeDisplay = z.infer<typeof CodeDisplaySchema>
export type ListDisplay = z.infer<typeof ListDisplaySchema>
export type MediaDisplay = z.infer<typeof MediaDisplaySchema>
export type MetricDisplay = z.infer<typeof MetricDisplaySchema>
export type ChartDisplay = z.infer<typeof ChartDisplaySchema>
export type TableDisplay = z.infer<typeof TableDisplaySchema>
export type GroupDisplay = z.infer<typeof GroupDisplaySchema>
export type CalloutDisplay = z.infer<typeof CalloutDisplaySchema>
export type DividerDisplay = z.infer<typeof DividerDisplaySchema>

// ─── Block types ───────────────────────────────────────────────────────────
export type BlockType = z.infer<typeof BlockTypeSchema>
export type TextBlock = z.infer<typeof TextBlockSchema>
export type KineticTextBlock_ = z.infer<typeof KineticTextBlockSchema>
export type CodeBlock = z.infer<typeof CodeBlockSchema>
export type ListBlock = z.infer<typeof ListBlockSchema>
export type MediaBlock = z.infer<typeof MediaBlockSchema>
export type MetricBlock = z.infer<typeof MetricBlockSchema>
export type ChartBlock = z.infer<typeof ChartBlockSchema>
export type TableBlock = z.infer<typeof TableBlockSchema>
export type GroupBlock_ = z.infer<typeof GroupBlockSchema>
export type CalloutBlock = z.infer<typeof CalloutBlockSchema>
export type DividerBlock = z.infer<typeof DividerBlockSchema>
export type XBlock = z.infer<typeof XBlockSchema>
export type ChartData = z.infer<typeof ChartDataSchema>
export type ChartDataset = z.infer<typeof ChartDatasetSchema>

// Re-export recursive types (declared as interfaces in blocks.ts)
export type { Block, GroupBlock, KineticTextBlock, ListItem }

// ─── Template ──────────────────────────────────────────────────────────────
export type TemplateCategory = z.infer<typeof TemplateCategorySchema>
export type LayoutMode = z.infer<typeof LayoutModeSchema>
export type ContentBudget = z.infer<typeof ContentBudgetSchema>
export type TemplateSlot = z.infer<typeof TemplateSlotSchema>
export type TemplateDefinition = z.infer<typeof TemplateDefinitionSchema>

// ─── Theme ─────────────────────────────────────────────────────────────────
export type MotionIntensity = z.infer<typeof MotionIntensitySchema>
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>
export type ThemePersonality = z.infer<typeof ThemePersonalitySchema>
export type ThemeDefinition = z.infer<typeof ThemeDefinitionSchema>

// ─── Slide ─────────────────────────────────────────────────────────────────
export type SlideBackground = z.infer<typeof SlideBackgroundSchema>
export type SlideAmbient = z.infer<typeof SlideAmbientSchema>
export type SlideSlots = z.infer<typeof SlideSlotsSchema>
export type SlotStyle = z.infer<typeof SlotStyleSchema>
export type Slide = z.infer<typeof SlideSchema>

// ─── Deck ──────────────────────────────────────────────────────────────────
export type AspectRatio = z.infer<typeof AspectRatioSchema>
export type DeckMeta = z.infer<typeof DeckMetaSchema>
export type DeckTheme = z.infer<typeof DeckThemeSchema>
export type Deck = z.infer<typeof DeckSchema>

// ─── Animation ─────────────────────────────────────────────────────────────
export type AnimatableProps = z.infer<typeof AnimatablePropsSchema>
export type BaseAnimation = z.infer<typeof BaseAnimationSchema>
export type BlockAnimation = z.infer<typeof BlockAnimationSchema>

// ─── Generation ────────────────────────────────────────────────────────────
export type GenerationEvent = z.infer<typeof GenerationEventSchema>
export type StartEvent = z.infer<typeof StartEventSchema>
export type OutlineEvent = z.infer<typeof OutlineEventSchema>
export type SlideStartEvent = z.infer<typeof SlideStartEventSchema>
export type SlideCompleteEvent = z.infer<typeof SlideCompleteEventSchema>
export type DoneEvent = z.infer<typeof DoneEventSchema>
export type ErrorEvent = z.infer<typeof ErrorEventSchema>
export type OutlineSlide = z.infer<typeof OutlineSlideSchema>
