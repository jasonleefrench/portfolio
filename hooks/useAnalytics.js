import { useMemo } from 'react'
import getFirebase from '../firebase'
import { getAnalytics, logEvent } from 'firebase/analytics'

const useAnalytics = () => {
    let analytics
    try {
        const app = getFirebase()
        analytics = getAnalytics(app)
    } catch (e) {
        console.error('Failed to initialize Firebase Analytics', e)
    }
    return useMemo(
        () =>
            analytics ? (tag, data) => logEvent(analytics, tag, data) : null,
        [analytics]
    )
}

export default useAnalytics
