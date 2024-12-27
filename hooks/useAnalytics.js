import { useMemo } from 'react'
import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: 'AIzaSyB3n2h3_I7ynmbZDvSRHfp4XLYdxT1stMs',
    authDomain: 'project-api-a2083.firebaseapp.com',
    projectId: 'project-api-a2083',
    storageBucket: 'project-api-a2083.firebasestorage.app',
    messagingSenderId: '534890120966',
    appId: '1:534890120966:web:b0a56e9b2e5746d3a38087',
    measurementId: 'G-EBNVP7EGBP',
}

const useAnalytics = () => {
    const app = initializeApp(firebaseConfig)
    const analytics = getAnalytics(app)
    return useMemo(
        () =>
            typeof window === 'undefined'
                ? () => null
                : (tag, data) => logEvent(analytics, tag, data),
        [analytics]
    )
}

export default useAnalytics
