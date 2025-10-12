import { useEffect, useRef, useState } from 'react'

const konamiCode = '38,38,40,40,37,39,37,39,66,65'
const konamiSequence = konamiCode.split(',').map((code) => parseInt(code))

const Konami = ({ callback, isActive }) => {
    const keys = useRef([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        function resize() {
            if (typeof window === 'undefined' || window.innerWidth < 1400) {
                setIsDisabled(true)
            } else {
                setIsDisabled(false)
            }
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        if (isDisabled) {
            return
        }
        function konami(callback) {
            keys.current = []
            setCurrentStep(0)
            return (event) => {
                keys.current.push(event.keyCode)

                const expectedKey = konamiSequence[keys.current.length - 1]
                if (event.keyCode === expectedKey) {
                    setCurrentStep(keys.current.length)

                    if (keys.current.toString().indexOf(konamiCode) >= 0) {
                        callback(event)
                        keys.current = []
                        setCurrentStep(0)
                    }
                } else {
                    keys.current = []
                    setCurrentStep(0)
                }
            }
        }
        const handler = konami(callback)
        window.addEventListener('keydown', handler, true)
        return () => window.removeEventListener('keydown', handler, true)
    }, [isDisabled, callback])

    const ArrowUp = ({ isActive }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
                filter: isActive
                    ? 'drop-shadow(0 0 3px rgba(76,175,80,0.6))'
                    : 'drop-shadow(inset 0 1px 2px rgba(0,0,0,0.2))',
            }}
        >
            <path
                d="M12 4L20 12H16V20H8V12H4L12 4Z"
                fill={isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'}
                stroke={isActive ? '#4caf50' : 'rgba(255,255,255,0.8)'}
                strokeWidth="1"
            />
        </svg>
    )

    const ArrowDown = ({ isActive }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
                filter: isActive
                    ? 'drop-shadow(0 0 3px rgba(76,175,80,0.6))'
                    : 'drop-shadow(inset 0 1px 2px rgba(0,0,0,0.2))',
            }}
        >
            <path
                d="M12 20L4 12H8V4H16V12H20L12 20Z"
                fill={isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'}
                stroke={isActive ? '#4caf50' : 'rgba(255,255,255,0.8)'}
                strokeWidth="1"
            />
        </svg>
    )

    const ArrowLeft = ({ isActive }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
                filter: isActive
                    ? 'drop-shadow(0 0 3px rgba(76,175,80,0.6))'
                    : 'drop-shadow(inset 0 1px 2px rgba(0,0,0,0.2))',
            }}
        >
            <path
                d="M4 12L12 4V8H20V16H12V20L4 12Z"
                fill={isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'}
                stroke={isActive ? '#4caf50' : 'rgba(255,255,255,0.8)'}
                strokeWidth="1"
            />
        </svg>
    )

    const ArrowRight = ({ isActive }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
                filter: isActive
                    ? 'drop-shadow(0 0 3px rgba(76,175,80,0.6))'
                    : 'drop-shadow(inset 0 1px 2px rgba(0,0,0,0.2))',
            }}
        >
            <path
                d="M20 12L12 20V16H4V8H12V4L20 12Z"
                fill={isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'}
                stroke={isActive ? '#4caf50' : 'rgba(255,255,255,0.8)'}
                strokeWidth="1"
            />
        </svg>
    )

    const ButtonB = ({ isActive }) => (
        <div
            style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `1px solid ${
                    isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'
                }`,
                backgroundColor: isActive ? '#4caf50' : 'rgba(255,255,255,0.4)',
                color: isActive ? '#fff' : 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: isActive
                    ? '0 0 6px rgba(76,175,80,0.4)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
            }}
        >
            B
        </div>
    )

    const ButtonA = ({ isActive }) => (
        <div
            style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `1px solid ${
                    isActive ? '#4caf50' : 'rgba(255,255,255,0.6)'
                }`,
                backgroundColor: isActive ? '#4caf50' : 'rgba(255,255,255,0.4)',
                color: isActive ? '#fff' : 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: isActive
                    ? '0 0 6px rgba(76,175,80,0.4)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
            }}
        >
            A
        </div>
    )

    const getComponent = (keyCode, index) => {
        const isActive = index < currentStep
        switch (keyCode) {
            case 38:
                return <ArrowUp isActive={isActive} />
            case 40:
                return <ArrowDown isActive={isActive} />
            case 37:
                return <ArrowLeft isActive={isActive} />
            case 39:
                return <ArrowRight isActive={isActive} />
            case 66:
                return <ButtonB isActive={isActive} />
            case 65:
                return <ButtonA isActive={isActive} />
            default:
                return null
        }
    }
    return (
        !isDisabled && (
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 999,
                        opacity: currentStep > 0 ? 1 : 0.7,
                        transition: 'opacity 0.3s ease',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }}
                >
                    {konamiSequence.map((keyCode, index) => (
                        <div
                            key={index}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {getComponent(keyCode, index)}
                            {index < konamiSequence.length - 1 && (
                                <span
                                    style={{
                                        color: 'rgba(255,255,255,0.4)',
                                        margin: '0 2px',
                                        fontSize: '8px',
                                    }}
                                >
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                {isActive && (
                    <div
                        style={{
                            color: '#4caf50',
                            fontSize: '12px',
                            marginLeft: '6px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            textShadow: '0 0 5px rgba(76,175,80,0.7)',
                        }}
                    >
                        Game of Life mode active
                    </div>
                )}
            </div>
        )
    )
}

export default Konami
