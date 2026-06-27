import { useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+-=<>{}[]'

export default function MatrixBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const SIZE = 14  
    let cols, rows, grid

    const buildGrid = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.ceil(canvas.width  / SIZE)
      rows = Math.ceil(canvas.height / SIZE)

      grid = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => ({
          char:    CHARS[Math.floor(Math.random() * CHARS.length)],
          opacity: Math.random() * 0.13 + 0.02,   // 2–15% visible
          bright:  Math.random() < 0.04,           // 4% are slightly brighter
        }))
      )
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${SIZE - 2}px 'Courier New', monospace`
      ctx.textBaseline = 'top'

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cell = grid[c][r]
          const alpha = cell.bright ? cell.opacity * 3 : cell.opacity
          ctx.fillStyle = `rgba(167,139,250,${alpha})`   // purple-ish tint
          ctx.fillText(cell.char, c * SIZE, r * SIZE)
        }
      }
    }

    buildGrid()
    draw()

    /* Randomly swap ~0.8% of chars each tick */
    const ticker = setInterval(() => {
      const count = Math.floor(cols * rows * 0.008)
      for (let k = 0; k < count; k++) {
        const c = Math.floor(Math.random() * cols)
        const r = Math.floor(Math.random() * rows)
        grid[c][r].char   = CHARS[Math.floor(Math.random() * CHARS.length)]
        grid[c][r].bright = Math.random() < 0.04
      }
      draw()
    }, 120)

    const onResize = () => { buildGrid(); draw() }
    window.addEventListener('resize', onResize)

    return () => {
      clearInterval(ticker)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  )
}
