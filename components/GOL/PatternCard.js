import { useRef, useEffect } from 'react'

const PatternCard = ({ pattern }) => {
    const canvas = useRef(null)

    useEffect(() => {
        const ctx = canvas.current.getContext('2d')

        // Calculate dynamic cell size to fit within a reasonable card size
        const maxCardSize = 80 // Maximum card dimension in pixels
        const patternWidth = pattern[0].length
        const patternHeight = pattern.length
        const maxPatternDimension = Math.max(patternWidth, patternHeight)

        // Scale down cell size for large patterns
        const cellSize = Math.min(
            10,
            Math.floor(maxCardSize / maxPatternDimension)
        )

        // Clear canvas
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

        // Set canvas size based on scaled cell size
        const canvasWidth = patternWidth * cellSize
        const canvasHeight = patternHeight * cellSize

        canvas.current.width = canvasWidth
        canvas.current.height = canvasHeight

        // Draw pattern
        pattern.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = '#1976d2' // Blue for live cells
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                } else {
                    ctx.fillStyle = 'rgba(0,0,0,0.02)' // Very faint gray for dead cells
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                }

                // Add subtle grid lines for better visibility
                ctx.strokeStyle = 'rgba(0,0,0,0.15)'
                ctx.lineWidth = 0.5
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
            })
        })
    }, [pattern])

    return (
        <canvas
            ref={canvas}
            style={{
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.8)',
            }}
        />
    )
}

export default PatternCard
