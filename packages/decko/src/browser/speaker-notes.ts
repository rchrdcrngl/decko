const CHANNEL_NAME = 'decko-notes'

const POPUP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Presenter View</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0f0f1a;
    color: #f8f8f2;
    font-family: system-ui, sans-serif;
    display: grid;
    grid-template-rows: auto auto 1fr auto auto;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Header: timer + counter ── */
  #header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1.25rem;
    background: #1a1a2e;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    gap: 1rem;
  }
  #counter { font-size: 0.85rem; color: #6e6e8e; white-space: nowrap; }
  #timer { font-size: 1.1rem; font-family: monospace; color: #f97316; letter-spacing: 0.05em; }
  #header-btns { display: flex; gap: 0.5rem; }
  .hbtn {
    background: none;
    border: 1px solid rgba(255,255,255,0.1);
    color: #a0a0c0;
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 0.375rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .hbtn:hover { background: rgba(255,255,255,0.07); }
  .hbtn.active { border-color: #f97316; color: #f97316; }

  /* ── Nav controls ── */
  #controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.6rem 1.25rem;
    background: #13131f;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-btn {
    background: #1a1a2e;
    border: 1px solid rgba(255,255,255,0.1);
    color: #f8f8f2;
    font-size: 1rem;
    padding: 0.4rem 1.1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.12s;
  }
  .nav-btn:hover { background: #252540; }
  .nav-btn:disabled { opacity: 0.3; cursor: default; }
  #jump-wrap {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #6e6e8e;
  }
  #jump {
    width: 3.5rem;
    background: #1a1a2e;
    border: 1px solid rgba(255,255,255,0.1);
    color: #f8f8f2;
    font-size: 0.85rem;
    padding: 0.3rem 0.5rem;
    border-radius: 0.375rem;
    text-align: center;
  }
  #jump:focus { outline: 1px solid #f97316; }

  /* ── Notes ── */
  #notes-area { padding: 1.25rem 1.75rem; overflow-y: auto; }
  #notes-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6e6e8e;
    margin-bottom: 0.6rem;
  }
  #notes { font-size: 1.25rem; line-height: 1.65; color: #f8f8f2; white-space: pre-wrap; }
  #notes.empty { color: #2e2e4a; font-style: italic; font-size: 1rem; }

  /* ── Next slide ── */
  #next-area {
    padding: 0.6rem 1.25rem;
    background: #1a1a2e;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  #next-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6e6e8e; margin-bottom: 0.2rem; }
  #next-title { font-size: 0.9rem; color: #a0a0c0; }

  /* ── Blank overlay on main (communicated via opener) ── */
</style>
</head>
<body>
  <div id="header">
    <span id="counter">– / –</span>
    <span id="timer">0:00:00</span>
    <div id="header-btns">
      <button class="hbtn" id="reset-btn">Reset timer</button>
      <button class="hbtn" id="fs-btn">⛶ Fullscreen</button>
      <button class="hbtn" id="blank-btn">⬛ Blank</button>
    </div>
  </div>

  <div id="controls">
    <button class="nav-btn" id="prev-btn" disabled>&#8592; Prev</button>
    <div id="jump-wrap">
      Go to <input id="jump" type="number" min="1" value="1"> <button class="nav-btn" id="jump-btn" style="padding:0.4rem 0.7rem">Go</button>
    </div>
    <button class="nav-btn" id="next-btn">Next &#8594;</button>
  </div>

  <div id="notes-area">
    <div id="notes-label">Speaker Notes</div>
    <div id="notes" class="empty">No notes for this slide.</div>
  </div>

  <div id="next-area">
    <div id="next-label">Up next</div>
    <div id="next-title">–</div>
  </div>

  <script>
    let current = 0
    let total = 1
    let blanked = false

    // ── Timer ──
    let start = Date.now()
    const timerEl = document.getElementById('timer')
    function tick() {
      const s = Math.floor((Date.now() - start) / 1000)
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = s % 60
      timerEl.textContent = h + ':' + String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0')
    }
    setInterval(tick, 1000)
    document.getElementById('reset-btn').addEventListener('click', () => { start = Date.now() })

    // ── Nav helpers ──
    const prevBtn = document.getElementById('prev-btn')
    const nextBtn = document.getElementById('next-btn')
    const jumpInput = document.getElementById('jump')

    function goTo(n) {
      ch.postMessage({ cmd: 'goTo', index: n })
    }

    function updateButtons() {
      prevBtn.disabled = current === 0
      nextBtn.disabled = current === total - 1
      jumpInput.value = current + 1
    }

    prevBtn.addEventListener('click', () => goTo(current - 1))
    nextBtn.addEventListener('click', () => goTo(current + 1))
    document.getElementById('jump-btn').addEventListener('click', () => {
      const n = parseInt(jumpInput.value, 10)
      if (!isNaN(n)) goTo(n - 1)
    })
    jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const n = parseInt(jumpInput.value, 10); if (!isNaN(n)) goTo(n - 1) }
    })

    // keyboard in presenter window also drives main
    document.addEventListener('keydown', (e) => {
      if (e.target === jumpInput) return
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1)
      if (e.key === 'ArrowLeft') goTo(current - 1)
    })

    // ── Fullscreen (main window) ──
    document.getElementById('fs-btn').addEventListener('click', () => {
      ch.postMessage({ cmd: 'fullscreen' })
    })

    // ── Blank main screen ──
    const blankBtn = document.getElementById('blank-btn')
    blankBtn.addEventListener('click', () => {
      blanked = !blanked
      ch.postMessage({ cmd: 'blank', value: blanked })
      blankBtn.textContent = blanked ? '▣ Unblank' : '⬛ Blank'
      blankBtn.classList.toggle('active', blanked)
    })

    // ── Receive updates from main ──
    const notesEl = document.getElementById('notes')
    const counterEl = document.getElementById('counter')
    const nextEl = document.getElementById('next-title')

    const ch = new BroadcastChannel('decko-notes')
    ch.onmessage = (e) => {
      const data = e.data
      current = data.current
      total = data.total
      notesEl.textContent = data.notes || 'No notes for this slide.'
      notesEl.className = data.notes ? '' : 'empty'
      counterEl.textContent = (current + 1) + ' / ' + total
      nextEl.textContent = data.nextTitle || '(end of deck)'
      updateButtons()
    }
  </script>
</body>
</html>`

export class SpeakerNotes {
  private channel: BroadcastChannel | null = null
  private notesWindow: Window | null = null
  onNavigate?: (index: number) => void
  onFullscreen?: () => void
  onBlank?: (value: boolean) => void

  open(): void {
    this.notesWindow = window.open('', 'decko-presenter', 'width=720,height=560')
    if (!this.notesWindow) return
    this.notesWindow.document.open()
    this.notesWindow.document.write(POPUP_HTML)
    this.notesWindow.document.close()
    this.channel = new BroadcastChannel(CHANNEL_NAME)
    this.channel.onmessage = (e: MessageEvent) => {
      const { cmd } = e.data as { cmd: string; index?: number; value?: boolean }
      if (cmd === 'goTo' && this.onNavigate) this.onNavigate(e.data.index as number)
      if (cmd === 'fullscreen' && this.onFullscreen) this.onFullscreen()
      if (cmd === 'blank' && this.onBlank) this.onBlank(e.data.value as boolean)
    }
  }

  send(notes: string, current: number, total: number, nextTitle: string): void {
    if (!this.channel) return
    this.channel.postMessage({ notes, current, total, nextTitle })
  }

  get isOpen(): boolean {
    return this.notesWindow !== null && !this.notesWindow.closed
  }

  close(): void {
    this.channel?.close()
    this.notesWindow?.close()
    this.channel = null
    this.notesWindow = null
  }
}
