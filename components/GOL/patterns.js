const patterns = {
    // Spaceships - Lightweight Spaceship (LWSS) in all 4 directions
    // Standard LWSS moving right (verified pattern)
    lwss_right: [
        [1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
    ],
    // LWSS moving left (verified pattern)
    lwss_left: [
        [0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    // LWSS moving down (proper 90° clockwise rotation of lwss_right)
    lwss_down: [
        [0, 1, 0, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
    ],
    // LWSS moving up (proper 90° counter-clockwise rotation of lwss_right)
    lwss_up: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 1],
    ],
    // Gliders in all 4 diagonal directions
    // Standard glider moving southeast
    glider_se: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
    ],
    // Glider moving southwest
    glider_sw: [
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
    ],
    // Glider moving northeast
    glider_ne: [
        [1, 1, 1],
        [0, 0, 1],
        [0, 1, 0],
    ],
    // Glider moving northwest
    glider_nw: [
        [1, 1, 1],
        [1, 0, 0],
        [0, 1, 0],
    ],
    // Oscillators
    blinker: [[1, 1, 1]],
    toad: [
        [0, 1, 1, 1],
        [1, 1, 1, 0],
    ],
    beacon: [
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 1],
    ],
    pulsar: [
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    ],
    // Still lifes
    block: [
        [1, 1],
        [1, 1],
    ],
    beehive: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
    ],
    loaf: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
    ],
    // Methuselahs (long-lived chaotic patterns)
    r_pentomino: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 1, 0],
    ],
    diehard: [
        [0, 0, 0, 0, 0, 0, 1, 0],
        [1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 1],
    ],
    acorn: [
        [0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 0, 1, 1, 1],
    ],
}

export default patterns
