import type { Slide, Block, BlockAnimation, SlotStyle } from '@deckohq/core'
import { renderBlock } from './block-renderer.js'
import { escapeHtml } from './utils/escape.js'

function resolveSlotAnimation(
  blocks: Block[],
  slideAnimations: Record<string, BlockAnimation> | undefined,
  slotId: string,
): BlockAnimation | undefined {
  // Use first block's animation as the default for the slot
  const blockAnim = blocks[0] && 'animation' in blocks[0] ? blocks[0].animation : undefined
  const slideAnim = slideAnimations?.[slotId]
  if (!blockAnim && !slideAnim) return undefined
  if (slideAnim && blockAnim) return { ...blockAnim, ...slideAnim }
  return slideAnim ?? blockAnim
}

function slotStyleToInline(s: SlotStyle): string {
  const parts: string[] = []
  if (s.position) parts.push(`position:${s.position}`)
  if (s.top) parts.push(`top:${s.top}`)
  if (s.left) parts.push(`left:${s.left}`)
  if (s.right) parts.push(`right:${s.right}`)
  if (s.bottom) parts.push(`bottom:${s.bottom}`)
  if (s.width) parts.push(`width:${s.width}`)
  if (s.height) parts.push(`height:${s.height}`)
  if (s.zIndex !== undefined) parts.push(`z-index:${s.zIndex}`)
  if (s.transformOrigin) parts.push(`transform-origin:${s.transformOrigin}`)
  return parts.join(';')
}

export function renderSlide(slide: Slide, index: number): string {
  const idAttr = slide.id ? ` id="${slide.id}"` : ''
  const transitionAttr = slide.transition
    ? ` data-transition="${slide.transition.type}"`
    : ''
  const transitionDirAttr = (() => {
    const t = slide.transition
    if (t && (t.type === 'pan' || t.type === 'wipe') && 'direction' in t)
      return ` data-transition-dir="${t.direction}"`
    return ''
  })()
  const ambientAttr = slide.ambient
    ? ` data-ambient="${slide.ambient.type}" data-ambient-intensity="${slide.ambient.intensity ?? 'medium'}"`
    : ''
  const notesAttr = slide.notes
    ? ` data-notes="${slide.notes.replace(/"/g, '&quot;')}"`
    : ''

  const bgStyle = (() => {
    const bg = slide.background
    if (!bg) return ''
    if (bg.type === 'color') return `background:${bg.value};`
    if (bg.type === 'gradient') return `background:${bg.value};`
    if (bg.type === 'image') return `background:url('${bg.src}') center/cover no-repeat;`
    return ''
  })()
  const slideStyleAttr = bgStyle ? ` style="${bgStyle}"` : ''

  const slotHtml = Object.entries(slide.slots)
    .map(([slotId, content], slotIndex) => {
      const blocks: Block[] = Array.isArray(content) ? content : [content]
      const inner = blocks.map(renderBlock).join('')
      const anim = resolveSlotAnimation(blocks, slide.animations, slotId)
      const animAttr = anim
        ? ` data-animation="${escapeHtml(JSON.stringify(anim))}"`
        : ''
      const slotStyle = slide.slotStyles?.[slotId]
      const styleAttr = slotStyle ? ` style="${slotStyleToInline(slotStyle)}"` : ''
      return `<div class="decko-slot" data-slot="${slotId}" data-slot-index="${slotIndex}"${styleAttr}${animAttr}>${inner}</div>`
    })
    .join('')

  return `<section${idAttr} class="decko-slide" data-slide="${index}" data-template="${slide.templateId}"${transitionAttr}${transitionDirAttr}${ambientAttr}${notesAttr}${slideStyleAttr}>${slotHtml}</section>`
}
