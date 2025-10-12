import { useEffect, useRef, useState } from 'react'
import useAnalytics from '../../hooks/useAnalytics'
import patterns from './patterns'
import PatternCard from './PatternCard'

const GOL = ({ screenElement, isActive }) => {
    const analytics = useAnalytics()

    const canvasRef = useRef(null)
    const [selectedPattern, setSelectedPattern] = useState('lwss_right')
    const [isPanelVisible, setIsPanelVisible] = useState(true)
    const gridRef = useRef(null)
    const dimensionsRef = useRef({ cols: 0, rows: 0, cellSize: 10 })

    const placePattern = (grid, pattern, startX, startY, cols, rows) => {
        console.log({ grid, pattern, startX, startY, cols, rows })

        if (!grid || !pattern || cols <= 0 || rows <= 0) return

        for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[y].length; x++) {
                const gridX = (startX + x) % cols
                const gridY = (startY + y) % rows
                if (
                    gridX >= 0 &&
                    gridX < cols &&
                    gridY >= 0 &&
                    gridY < rows &&
                    grid[gridX] &&
                    typeof grid[gridX][gridY] !== 'undefined'
                ) {
                    grid[gridX][gridY] = pattern[y][x]
                }
            }
        }
    }

    const handleCanvasClick = (event) => {
        if (!gridRef.current || !patterns[selectedPattern]) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const { cellSize, cols, rows } = dimensionsRef.current

        if (!cellSize || cols <= 0 || rows <= 0) return

        const x = Math.floor((event.clientX - rect.left) / cellSize)
        const y = Math.floor((event.clientY - rect.top) / cellSize)

        if (x < 0 || x >= cols || y < 0 || y >= rows) return

        if (screenElement) {
            const screenRect = screenElement.getBoundingClientRect()
            const excludeZone = {
                left: Math.floor(screenRect.left / cellSize),
                right: Math.ceil(screenRect.right / cellSize),
                top: Math.floor(screenRect.top / cellSize),
                bottom: Math.ceil(screenRect.bottom / cellSize),
            }

            const pattern = patterns[selectedPattern]
            const patternWidth = pattern[0].length
            const patternHeight = pattern.length

            for (let py = 0; py < patternHeight; py++) {
                for (let px = 0; px < patternWidth; px++) {
                    const gridX = x + px
                    const gridY = y + py

                    if (
                        gridX >= excludeZone.left &&
                        gridX < excludeZone.right &&
                        gridY >= excludeZone.top &&
                        gridY < excludeZone.bottom
                    ) {
                        return
                    }
                }
            }
        }

        placePattern(
            gridRef.current,
            patterns[selectedPattern],
            x,
            y,
            cols,
            rows
        )

        analytics('gol_place_pattern', {
            pattern: selectedPattern,
            position: { x, y },
        })
    }

    const handleReset = () => {
        if (!gridRef.current) return

        const { cols, rows } = dimensionsRef.current
        if (cols <= 0 || rows <= 0) return

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                gridRef.current[x][y] = 0
            }
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        if (!isActive) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            return
        }
        let animationFrameId

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const createGrid = (cols, rows) => {
            const grid = []

            // Initialize empty grid
            for (let x = 0; x < cols; x++) {
                grid[x] = []
                for (let y = 0; y < rows; y++) {
                    grid[x][y] = 0
                }
            }

            return grid
        }

        const getNextGeneration = (grid, cols, rows) => {
            const nextGen = []

            let excludeZone = null
            if (screenElement) {
                const rect = screenElement.getBoundingClientRect()
                excludeZone = {
                    left: Math.floor(rect.left / cellSize),
                    right: Math.ceil(rect.right / cellSize),
                    top: Math.floor(rect.top / cellSize),
                    bottom: Math.ceil(rect.bottom / cellSize),
                }
            }

            for (let x = 0; x < cols; x++) {
                nextGen[x] = []
                for (let y = 0; y < rows; y++) {
                    nextGen[x][y] = 0
                }
            }

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const state = grid[x][y]
                    if (state === 0) continue

                    let targetX = x
                    let targetY = y

                    let neighbors = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i === 0 && j === 0) continue

                            let col = (x + i + cols) % cols
                            let row = (y + j + rows) % rows

                            if (
                                col >= 0 &&
                                col < cols &&
                                row >= 0 &&
                                row < rows &&
                                grid[col]
                            ) {
                                neighbors += grid[col][row] || 0
                            }
                        }
                    }

                    const survives =
                        (state === 1 && (neighbors === 2 || neighbors === 3)) ||
                        (state === 0 && neighbors === 3)

                    if (survives) {
                        nextGen[targetX][targetY] = 1
                    }
                }
            }

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) continue
                    const inExcludeZone =
                        excludeZone &&
                        x >= excludeZone.left &&
                        x < excludeZone.right &&
                        y >= excludeZone.top &&
                        y < excludeZone.bottom

                    if (inExcludeZone) continue

                    let neighbors = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i === 0 && j === 0) continue

                            let col = (x + i + cols) % cols
                            let row = (y + j + rows) % rows

                            if (
                                col >= 0 &&
                                col < cols &&
                                row >= 0 &&
                                row < rows &&
                                grid[col]
                            ) {
                                neighbors += grid[col][row] || 0
                            }
                        }
                    }

                    if (neighbors === 3) {
                        nextGen[x][y] = 1
                    }
                }
            }
            return nextGen
        }

        const drawGrid = (grid, cols, rows, cellSize) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) {
                        const currentState = grid[x][y]
                        const prevState = prevGrid ? prevGrid[x][y] : 0

                        let color = 'pink'

                        if (currentState === 1 && prevState === 0) {
                            color = '#00ff88'
                        } else if (currentState === 1 && prevState === 1) {
                            color = '#88aaff'
                        }

                        ctx.fillStyle = color
                        ctx.fillRect(
                            x * cellSize,
                            y * cellSize,
                            cellSize - 1,
                            cellSize - 1
                        )
                    }
                }
            }
        }

        let cols, rows, cellSize, grid, prevGrid
        let lastUpdateTime = 0
        const updateInterval = 100

        const init = () => {
            resizeCanvas()
            cellSize = 10
            cols = Math.floor(canvas.width / cellSize)
            rows = Math.floor(canvas.height / cellSize)

            dimensionsRef.current = { cols, rows, cellSize }
            prevGrid = null
            grid = createGrid(cols, rows)
            gridRef.current = grid
        }

        const animate = (currentTime) => {
            if (currentTime - lastUpdateTime >= updateInterval) {
                prevGrid = grid ? grid.map((col) => [...col]) : null
                grid = getNextGeneration(grid, cols, rows)
                gridRef.current = grid
                lastUpdateTime = currentTime
            }
            drawGrid(grid, cols, rows, cellSize)
            animationFrameId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            init()
        }

        window.addEventListener('resize', handleResize)

        init()
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [screenElement, isActive])

    return (
        <div
            style={{
                display: isActive ? 'block' : 'none',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={handleReset}
                    style={{
                        background: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    }}
                    onMouseOver={(e) => (e.target.style.background = '#b71c1c')}
                    onMouseOut={(e) => (e.target.style.background = '#d32f2f')}
                >
                    Clear All
                </button>
            </div>

            {/* Pattern cards at bottom */}
            {isPanelVisible && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        zIndex: 1000,
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.2)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                        }}
                    >
                        <div
                            style={{
                                color: '#333333',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                flex: 1,
                                textAlign: 'center',
                            }}
                        >
                            Click to select, then click to place
                        </div>
                        <button
                            onClick={() => setIsPanelVisible(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '4px',
                                borderRadius: '4px',
                                marginLeft: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onMouseOver={(e) => (e.target.style.color = '#333')}
                            onMouseOut={(e) => (e.target.style.color = '#666')}
                        >
                            ▲
                        </button>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            overflowX: 'auto',
                            paddingBottom: '16px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(0,0,0,0.3) transparent',
                        }}
                    >
                        {Object.entries(patterns).map(([key, pattern]) => {
                            const patternNames = {
                                lwss_up: ['Lightweight Spaceship', '↑'],
                                lwss_down: ['Lightweight Spaceship', '↓'],
                                lwss_left: ['Lightweight Spaceship', '←'],
                                lwss_right: ['Lightweight Spaceship', '→'],
                                glider_ne: ['Glider', '↗'],
                                glider_nw: ['Glider', '↖'],
                                glider_se: ['Glider', '↘'],
                                glider_sw: ['Glider', '↙'],
                                blinker: ['Blinker Oscillator'],
                                toad: ['Toad Oscillator'],
                                beacon: ['Beacon Oscillator'],
                                pulsar: ['Pulsar Oscillator'],
                                block: ['Block', '(Still Life)'],
                                beehive: ['Beehive', '(Still Life)'],
                                loaf: ['Loaf', '(Still Life)'],
                                r_pentomino: ['R-Pentomino', '(Methuselah)'],
                                diehard: ['Diehard', '(Methuselah)'],
                                acorn: ['Acorn', '(Methuselah)'],
                            }

                            return (
                                <div
                                    key={key}
                                    onClick={() => setSelectedPattern(key)}
                                    style={{
                                        minWidth: '140px',
                                        cursor: 'pointer',
                                        border:
                                            selectedPattern === key
                                                ? '2px solid #1976d2'
                                                : '2px solid rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        background:
                                            selectedPattern === key
                                                ? 'rgba(25,118,210,0.1)'
                                                : 'rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {patternNames[key].map(
                                            (line, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        color: '#333333',
                                                        fontSize: '11px',
                                                        textAlign: 'center',
                                                        fontWeight:
                                                            selectedPattern ===
                                                            key
                                                                ? 'bold'
                                                                : 'normal',
                                                        lineHeight: '1.2',
                                                    }}
                                                >
                                                    {line}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <PatternCard pattern={pattern} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Toggle button when panel is hidden */}
            {!isPanelVisible && (
                <button
                    onClick={() => setIsPanelVisible(true)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#666',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = '#f5f5f5'
                        e.target.style.color = '#333'
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'white'
                        e.target.style.color = '#666'
                    }}
                >
                    ▼
                </button>
            )}

            <canvas
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    cursor: 'crosshair',
                }}
                ref={canvasRef}
                onClick={handleCanvasClick}
            />
        </div>
    )
}

export default GOL
