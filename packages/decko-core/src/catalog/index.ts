import type { TemplateDefinition } from '../types/index.js'
import type { TemplateRegistry } from '../registry/template-registry.js'

export * from './narrative/index.js'
export * from './content/index.js'
export * from './data/index.js'
export * from './visual/index.js'
export * from './technical/index.js'

import {
  titleSlide,
  sectionBreak,
  agenda,
  closing,
  quote,
} from './narrative/index.js'
import {
  singleColumn,
  twoColumn,
  headerBody,
  bulletsMedia,
  threeUp,
} from './content/index.js'
import { bigMetric, metricTrio, chartCallout, tableSlide } from './data/index.js'
import {
  fullBleedMedia,
  mediaCaption,
  imageGrid,
  comparison,
  kineticCanvas,
  kineticHero,
} from './visual/index.js'
import { codeWalkthrough, architectureDiagram, terminal } from './technical/index.js'

export const BUILT_IN_TEMPLATES: TemplateDefinition[] = [
  // narrative
  titleSlide,
  sectionBreak,
  agenda,
  closing,
  quote,
  // content
  singleColumn,
  twoColumn,
  headerBody,
  bulletsMedia,
  threeUp,
  // data
  bigMetric,
  metricTrio,
  chartCallout,
  tableSlide,
  // visual
  fullBleedMedia,
  mediaCaption,
  imageGrid,
  comparison,
  kineticCanvas,
  kineticHero,
  // technical
  codeWalkthrough,
  architectureDiagram,
  terminal,
]

export function populateTemplateRegistry(registry: TemplateRegistry): void {
  for (const template of BUILT_IN_TEMPLATES) {
    registry.register(template)
  }
}
