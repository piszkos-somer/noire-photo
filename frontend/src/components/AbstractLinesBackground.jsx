import React, { useEffect, useRef } from "react"

export default function AbstractLinesBackground() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const pointsRef = useRef([])
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { alpha: true })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initPoints()
    }

    const initPoints = () => {
      const { w, h } = sizeRef.current
      const area = w * h
      const count = Math.max(70, Math.min(170, Math.floor(area / 14000)))
      const pts = []
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const speed = 0.18 + Math.random() * 0.35
        const angle = Math.random() * Math.PI * 2
        pts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          base: 0.5 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
        })
      }
      pointsRef.current = pts
    }

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const onLeave = () => {
      mouseRef.current.active = false
    }

    const step = (t) => {
      const { w, h } = sizeRef.current
      const pts = pointsRef.current
      ctx.clearRect(0, 0, w, h)

      const time = t * 0.001
      const linkDist = Math.max(90, Math.min(160, Math.sqrt(w * h) / 9))
      const linkDist2 = linkDist * linkDist

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mActive = mouseRef.current.active
      const mouseDist = 220
      const mouseDist2 = mouseDist * mouseDist

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        const wobble = Math.sin(time * 0.9 + p.phase) * 0.12
        p.x += p.vx * (1 + wobble)
        p.y += p.vy * (1 + wobble)

        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > linkDist2) continue

          let alpha = (1 - d2 / linkDist2) * 0.22

          if (mActive) {
            const amx = a.x - mx
            const amy = a.y - my
            const bmx = b.x - mx
            const bmy = b.y - my
            const am2 = amx * amx + amy * amy
            const bm2 = bmx * bmx + bmy * bmy
            const boost = (1 - Math.min(am2, bm2) / mouseDist2)
            if (boost > 0) alpha += boost * 0.12
          }

          ctx.globalAlpha = Math.max(0, Math.min(0.35, alpha))
          ctx.lineWidth = 1
          ctx.strokeStyle = "rgba(0,0,0,1)"
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        const pulse = 0.6 + 0.4 * Math.sin(time * 1.2 + p.phase)
        let a = 0.12 * p.base * pulse

        if (mActive) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          const boost = (1 - d2 / mouseDist2)
          if (boost > 0) a += boost * 0.18
        }

        ctx.globalAlpha = Math.max(0, Math.min(0.38, a))
        ctx.fillStyle = "rgba(0,0,0,1)"
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(step)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseleave", onLeave)
    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="abstract-lines-bg" aria-hidden="true" />
}
