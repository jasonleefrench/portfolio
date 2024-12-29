import { initializeApp } from 'firebase/app'

const getFirebase = () =>
    initializeApp({
        apiKey: 'AIzaSyB3n2h3_I7ynmbZDvSRHfp4XLYdxT1stMs',
        authDomain: 'project-api-a2083.firebaseapp.com',
        projectId: 'project-api-a2083',
        storageBucket: 'project-api-a2083.firebasestorage.app',
        messagingSenderId: '534890120966',
        appId: '1:534890120966:web:b0a56e9b2e5746d3a38087',
        measurementId: 'G-EBNVP7EGBP',
    })

export default getFirebase
