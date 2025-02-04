import { useEffect, useState, useMemo } from 'react'
import getFirebase from '../firebase'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

const useAnalytics = () => {
    const [analytics, setAnalytics] = useState(null)
    useEffect(() => {
        const app = getFirebase()
        isSupported().then((yes) => {
            if (yes) {
                const analytics = getAnalytics(app)
                setAnalytics(analytics)
            }
        })
    }, [])
    return useMemo(
        () =>
            analytics
                ? (tag, data) => logEvent(analytics, tag, data)
                : () => {},
        [analytics]
    )
}

export default useAnalytics
