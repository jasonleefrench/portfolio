import { useMemo } from 'react'
import getFirebase from '../firebase'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

const useAnalytics = () => {
    let analytics
    try {
        const app = getFirebase()
        analytics = isSupported().then((yes) =>
            yes ? getAnalytics(app) : null
        )
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
