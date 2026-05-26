import { describe, it, expect } from 'vitest'
import {
  BlockSchema,
  TextBlockSchema,
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
} from '../../src/schemas/blocks.js'

describe('TextBlockSchema', () => {
  it('accepts minimal text block', () => {
    expect(TextBlockSchema.safeParse({ type: 'text', content: 'Hello' }).success).toBe(true)
  })

  it('accepts text block with display variant', () => {
    expect(TextBlockSchema.safeParse({ type: 'text', display: 'heading', content: 'Title' }).success).toBe(true)
  })

  it('accepts all valid display variants', () => {
    const displays = ['heading', 'subheading', 'body', 'label', 'caption', 'quote', 'eyebrow', 'hero']
    for (const display of displays) {
      expect(TextBlockSchema.safeParse({ type: 'text', display, content: 'x' }).success).toBe(true)
    }
  })

  it('accepts inline node array as content', () => {
    const block = { type: 'text', content: [{ text: 'bold', bold: true }] }
    expect(TextBlockSchema.safeParse(block).success).toBe(true)
  })

  it('rejects unknown display variant', () => {
    expect(TextBlockSchema.safeParse({ type: 'text', display: 'giant', content: 'x' }).success).toBe(false)
  })

  it('rejects missing content', () => {
    expect(TextBlockSchema.safeParse({ type: 'text' }).success).toBe(false)
  })
})

describe('CodeBlockSchema', () => {
  it('accepts minimal code block', () => {
    expect(CodeBlockSchema.safeParse({ type: 'code', code: 'const x = 1' }).success).toBe(true)
  })

  it('accepts code block with all optional fields', () => {
    const block = {
      type: 'code',
      display: 'terminal',
      code: 'npm install decko',
      language: 'bash',
      filename: 'install.sh',
      highlight: [1, 2],
    }
    expect(CodeBlockSchema.safeParse(block).success).toBe(true)
  })

  it('rejects missing code field', () => {
    expect(CodeBlockSchema.safeParse({ type: 'code' }).success).toBe(false)
  })
})

describe('ListBlockSchema', () => {
  it('accepts a list with one item', () => {
    expect(ListBlockSchema.safeParse({ type: 'list', items: [{ text: 'item 1' }] }).success).toBe(true)
  })

  it('accepts a checklist with checked items', () => {
    const block = {
      type: 'list',
      display: 'checklist',
      items: [{ text: 'done', checked: true }, { text: 'not done', checked: false }],
    }
    expect(ListBlockSchema.safeParse(block).success).toBe(true)
  })

  it('accepts nested list items', () => {
    const block = {
      type: 'list',
      items: [{ text: 'parent', children: [{ text: 'child' }] }],
    }
    expect(ListBlockSchema.safeParse(block).success).toBe(true)
  })

  it('rejects empty items array', () => {
    expect(ListBlockSchema.safeParse({ type: 'list', items: [] }).success).toBe(false)
  })
})

describe('MediaBlockSchema', () => {
  it('accepts minimal media block', () => {
    expect(MediaBlockSchema.safeParse({ type: 'media', src: '/img/hero.png' }).success).toBe(true)
  })

  it('accepts all display variants', () => {
    for (const display of ['image', 'video', 'icon', 'avatar', 'logo']) {
      expect(MediaBlockSchema.safeParse({ type: 'media', display, src: '/x.png' }).success).toBe(true)
    }
  })

  it('rejects missing src', () => {
    expect(MediaBlockSchema.safeParse({ type: 'media' }).success).toBe(false)
  })
})

describe('MetricBlockSchema', () => {
  it('accepts metric with string value', () => {
    expect(MetricBlockSchema.safeParse({ type: 'metric', value: '$4.2M', label: 'ARR' }).success).toBe(true)
  })

  it('accepts metric with number value', () => {
    expect(MetricBlockSchema.safeParse({ type: 'metric', value: 99.9, label: 'Uptime %' }).success).toBe(true)
  })

  it('accepts metric with trend', () => {
    const block = { type: 'metric', value: '42%', label: 'Growth', trend: 'up', delta: '+12%' }
    expect(MetricBlockSchema.safeParse(block).success).toBe(true)
  })

  it('rejects invalid trend value', () => {
    const block = { type: 'metric', value: '42%', label: 'Growth', trend: 'sideways' }
    expect(MetricBlockSchema.safeParse(block).success).toBe(false)
  })

  it('rejects missing label', () => {
    expect(MetricBlockSchema.safeParse({ type: 'metric', value: 42 }).success).toBe(false)
  })
})

describe('ChartBlockSchema', () => {
  const validData = {
    labels: ['Q1', 'Q2', 'Q3'],
    datasets: [{ values: [10, 20, 30] }],
  }

  it('accepts a bar chart', () => {
    expect(ChartBlockSchema.safeParse({ type: 'chart', chartType: 'bar', data: validData }).success).toBe(true)
  })

  it('accepts all chart types', () => {
    for (const chartType of ['bar', 'line', 'pie', 'donut', 'scatter']) {
      expect(ChartBlockSchema.safeParse({ type: 'chart', chartType, data: validData }).success).toBe(true)
    }
  })

  it('rejects unknown chart type', () => {
    expect(ChartBlockSchema.safeParse({ type: 'chart', chartType: 'radar', data: validData }).success).toBe(false)
  })

  it('rejects empty datasets', () => {
    const bad = { labels: ['Q1'], datasets: [] }
    expect(ChartBlockSchema.safeParse({ type: 'chart', chartType: 'bar', data: bad }).success).toBe(false)
  })
})

describe('TableBlockSchema', () => {
  it('accepts a valid table', () => {
    const block = {
      type: 'table',
      headers: ['Name', 'Score'],
      rows: [['Alice', '100'], ['Bob', '90']],
    }
    expect(TableBlockSchema.safeParse(block).success).toBe(true)
  })

  it('rejects empty headers', () => {
    expect(TableBlockSchema.safeParse({ type: 'table', headers: [], rows: [['a']] }).success).toBe(false)
  })

  it('rejects empty rows', () => {
    expect(TableBlockSchema.safeParse({ type: 'table', headers: ['A'], rows: [] }).success).toBe(false)
  })
})

describe('GroupBlockSchema', () => {
  it('accepts a group with nested blocks', () => {
    const block = {
      type: 'group',
      display: 'columns',
      blocks: [
        { type: 'text', content: 'left' },
        { type: 'text', content: 'right' },
      ],
    }
    expect(GroupBlockSchema.safeParse(block).success).toBe(true)
  })

  it('accepts deeply nested groups', () => {
    const inner = { type: 'group', blocks: [{ type: 'text', content: 'deep' }] }
    const outer = { type: 'group', blocks: [inner] }
    expect(GroupBlockSchema.safeParse(outer).success).toBe(true)
  })

  it('rejects unknown display variant', () => {
    const block = { type: 'group', display: 'masonry', blocks: [{ type: 'text', content: 'x' }] }
    expect(GroupBlockSchema.safeParse(block).success).toBe(false)
  })
})

describe('CalloutBlockSchema', () => {
  it('accepts a minimal callout', () => {
    expect(CalloutBlockSchema.safeParse({ type: 'callout', body: 'Note this' }).success).toBe(true)
  })

  it('accepts all display variants', () => {
    for (const display of ['info', 'warning', 'success', 'danger', 'neutral', 'highlight']) {
      expect(CalloutBlockSchema.safeParse({ type: 'callout', display, body: 'x' }).success).toBe(true)
    }
  })

  it('rejects missing body', () => {
    expect(CalloutBlockSchema.safeParse({ type: 'callout' }).success).toBe(false)
  })
})

describe('DividerBlockSchema', () => {
  it('accepts a minimal divider', () => {
    expect(DividerBlockSchema.safeParse({ type: 'divider' }).success).toBe(true)
  })

  it('accepts all display variants', () => {
    for (const display of ['line', 'dots', 'space', 'gradient']) {
      expect(DividerBlockSchema.safeParse({ type: 'divider', display }).success).toBe(true)
    }
  })
})

describe('XBlockSchema', () => {
  it('accepts a custom block with x- prefix', () => {
    expect(XBlockSchema.safeParse({ type: 'x-mermaid', props: { code: 'graph TD' } }).success).toBe(true)
  })

  it('accepts a kebab-case custom type', () => {
    expect(XBlockSchema.safeParse({ type: 'x-my-block', props: {} }).success).toBe(true)
  })

  it('rejects a custom block without x- prefix', () => {
    expect(XBlockSchema.safeParse({ type: 'mermaid', props: {} }).success).toBe(false)
  })

  it('rejects a type that starts with x but has no name', () => {
    expect(XBlockSchema.safeParse({ type: 'x-', props: {} }).success).toBe(false)
  })

  it('rejects missing props', () => {
    expect(XBlockSchema.safeParse({ type: 'x-custom' }).success).toBe(false)
  })
})

describe('BlockSchema (union)', () => {
  it('accepts all built-in block types', () => {
    const blocks = [
      { type: 'text', content: 'hi' },
      { type: 'code', code: 'x' },
      { type: 'list', items: [{ text: 'a' }] },
      { type: 'media', src: '/x.png' },
      { type: 'metric', value: '1', label: 'X' },
      { type: 'chart', chartType: 'bar', data: { labels: ['a'], datasets: [{ values: [1] }] } },
      { type: 'table', headers: ['h'], rows: [['r']] },
      { type: 'group', blocks: [] },
      { type: 'callout', body: 'note' },
      { type: 'divider' },
      { type: 'x-custom', props: {} },
    ]
    for (const block of blocks) {
      const result = BlockSchema.safeParse(block)
      expect(result.success, `Expected ${block.type} to be valid`).toBe(true)
    }
  })

  it('rejects an unknown type', () => {
    expect(BlockSchema.safeParse({ type: 'unknown' }).success).toBe(false)
  })
})
