import { describe, it, expect } from 'vitest'
import { renderBlock } from '../../src/renderer/block-renderer.js'

describe('renderBlock()', () => {
  describe('text block', () => {
    it('renders heading display as <h1>', () => {
      const html = renderBlock({ type: 'text', display: 'heading', content: 'Title' })
      expect(html).toContain('<h1')
      expect(html).toContain('Title')
      expect(html).toContain('</h1>')
    })

    it('renders subheading as <h2>', () => {
      const html = renderBlock({ type: 'text', display: 'subheading', content: 'Sub' })
      expect(html).toContain('<h2')
    })

    it('renders body display as <p>', () => {
      const html = renderBlock({ type: 'text', display: 'body', content: 'Body text' })
      expect(html).toContain('<p')
      expect(html).toContain('Body text')
    })

    it('renders default (no display) as <p>', () => {
      const html = renderBlock({ type: 'text', content: 'Default' })
      expect(html).toContain('<p')
    })

    it('includes decko-text class', () => {
      const html = renderBlock({ type: 'text', display: 'body', content: 'x' })
      expect(html).toContain('decko-text')
    })

    it('includes block id when provided', () => {
      const html = renderBlock({ type: 'text', content: 'x', id: 'my-block' })
      expect(html).toContain('id="my-block"')
    })
  })

  describe('code block', () => {
    it('renders as <pre><code>', () => {
      const html = renderBlock({ type: 'code', code: 'const x = 1' })
      expect(html).toContain('<pre')
      expect(html).toContain('<code')
      expect(html).toContain('const x = 1')
    })

    it('adds language class when language provided', () => {
      const html = renderBlock({ type: 'code', code: 'x', language: 'typescript' })
      expect(html).toContain('language-typescript')
    })

    it('escapes HTML in code', () => {
      const html = renderBlock({ type: 'code', code: '<script>alert()</script>' })
      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script&gt;')
    })
  })

  describe('list block', () => {
    it('renders bullets as <ul>', () => {
      const html = renderBlock({ type: 'list', display: 'bullets', items: [{ text: 'item' }] })
      expect(html).toContain('<ul')
    })

    it('renders numbered as <ol>', () => {
      const html = renderBlock({ type: 'list', display: 'numbered', items: [{ text: 'item' }] })
      expect(html).toContain('<ol')
    })

    it('renders each item as <li>', () => {
      const html = renderBlock({ type: 'list', items: [{ text: 'a' }, { text: 'b' }] })
      expect(html).toContain('<li')
      expect(html).toContain('a')
      expect(html).toContain('b')
    })

    it('renders checklist with checkbox data', () => {
      const html = renderBlock({
        type: 'list',
        display: 'checklist',
        items: [{ text: 'done', checked: true }],
      })
      expect(html).toContain('decko-list--checklist')
    })
  })

  describe('media block', () => {
    it('renders image display as <figure><img>', () => {
      const html = renderBlock({ type: 'media', display: 'image', src: '/img/hero.png' })
      expect(html).toContain('<figure')
      expect(html).toContain('<img')
      expect(html).toContain('/img/hero.png')
    })

    it('renders alt text on img', () => {
      const html = renderBlock({ type: 'media', src: '/x.png', alt: 'A description' })
      expect(html).toContain('alt="A description"')
    })

    it('renders caption in <figcaption> when provided', () => {
      const html = renderBlock({ type: 'media', src: '/x.png', caption: 'Caption text' })
      expect(html).toContain('<figcaption')
      expect(html).toContain('Caption text')
    })
  })

  describe('metric block', () => {
    it('renders value and label', () => {
      const html = renderBlock({ type: 'metric', value: '$4.2M', label: 'ARR' })
      expect(html).toContain('$4.2M')
      expect(html).toContain('ARR')
    })

    it('includes decko-metric class', () => {
      const html = renderBlock({ type: 'metric', value: 42, label: 'Score' })
      expect(html).toContain('decko-metric')
    })

    it('renders delta when provided', () => {
      const html = renderBlock({ type: 'metric', value: '10%', label: 'Growth', delta: '+2%' })
      expect(html).toContain('+2%')
    })

    it('includes trend direction class when provided', () => {
      const html = renderBlock({ type: 'metric', value: '10', label: 'X', trend: 'up' })
      expect(html).toContain('trend--up')
    })
  })

  describe('chart block', () => {
    const data = { labels: ['Q1', 'Q2'], datasets: [{ values: [10, 20] }] }

    it('renders a <canvas> element with data-chart attribute', () => {
      const html = renderBlock({ type: 'chart', chartType: 'bar', data })
      expect(html).toContain('<canvas')
      expect(html).toContain('data-chart=')
    })

    it('includes chart type in data-chart JSON', () => {
      const html = renderBlock({ type: 'chart', chartType: 'bar', data })
      expect(html).toContain('bar')
    })

    it('renders title in figcaption when provided', () => {
      const html = renderBlock({ type: 'chart', chartType: 'bar', data, title: 'Revenue' })
      expect(html).toContain('Revenue')
    })
  })

  describe('table block', () => {
    it('renders <table> with thead and tbody', () => {
      const html = renderBlock({
        type: 'table',
        headers: ['Name', 'Score'],
        rows: [['Alice', '100']],
      })
      expect(html).toContain('<table')
      expect(html).toContain('<thead')
      expect(html).toContain('<tbody')
      expect(html).toContain('Alice')
    })

    it('renders header cells as <th>', () => {
      const html = renderBlock({ type: 'table', headers: ['A', 'B'], rows: [['1', '2']] })
      expect(html).toContain('<th')
    })

    it('renders caption when provided', () => {
      const html = renderBlock({
        type: 'table',
        headers: ['A'],
        rows: [['1']],
        caption: 'My table',
      })
      expect(html).toContain('My table')
    })
  })

  describe('group block', () => {
    it('renders a wrapper div with decko-group class', () => {
      const html = renderBlock({
        type: 'group',
        blocks: [{ type: 'text', content: 'inner' }],
      })
      expect(html).toContain('<div')
      expect(html).toContain('decko-group')
    })

    it('renders nested blocks', () => {
      const html = renderBlock({
        type: 'group',
        blocks: [
          { type: 'text', content: 'left' },
          { type: 'text', content: 'right' },
        ],
      })
      expect(html).toContain('left')
      expect(html).toContain('right')
    })

    it('includes display variant class', () => {
      const html = renderBlock({
        type: 'group',
        display: 'columns',
        blocks: [{ type: 'text', content: 'x' }],
      })
      expect(html).toContain('decko-group--columns')
    })
  })

  describe('callout block', () => {
    it('renders as <aside role="note">', () => {
      const html = renderBlock({ type: 'callout', body: 'Note this' })
      expect(html).toContain('<aside')
      expect(html).toContain('role="note"')
    })

    it('renders body text', () => {
      const html = renderBlock({ type: 'callout', body: 'Important info' })
      expect(html).toContain('Important info')
    })

    it('renders title when provided', () => {
      const html = renderBlock({ type: 'callout', title: 'Heads up', body: 'Body' })
      expect(html).toContain('Heads up')
    })

    it('includes display variant class', () => {
      const html = renderBlock({ type: 'callout', display: 'warning', body: 'x' })
      expect(html).toContain('decko-callout--warning')
    })
  })

  describe('divider block', () => {
    it('renders as <hr>', () => {
      const html = renderBlock({ type: 'divider' })
      expect(html).toContain('<hr')
    })

    it('includes display variant class', () => {
      const html = renderBlock({ type: 'divider', display: 'dots' })
      expect(html).toContain('decko-divider--dots')
    })
  })

  describe('custom (x-*) block', () => {
    it('renders a div with data-block-type attribute', () => {
      const html = renderBlock({ type: 'x-mermaid', props: { code: 'graph TD' } })
      expect(html).toContain('<div')
      expect(html).toContain('data-block-type="x-mermaid"')
    })
  })

  describe('XSS safety', () => {
    it('escapes text content to prevent XSS', () => {
      const html = renderBlock({ type: 'text', content: '<img onerror="xss()">' })
      expect(html).not.toContain('<img')
    })
  })
})
