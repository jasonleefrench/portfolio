import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import getFirebase from '../firebase'

const useAuth = () => {
    const firebase = getFirebase()
    const auth = getAuth(firebase)
    const [error, setError] = useState()
    const [loggedInUser, setLoggedInUser] = useState()
    const [loading, setLoading] = useState(false)
    const [checkedAuth, setCheckedAuth] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedInUser(user)
            } else {
                setLoggedInUser(undefined)
            }
            setCheckedAuth(true)
        })
        return () => unsubscribe()
    }, [auth])

    const signInWithEmailAndPassword = useCallback(
        async (email, password) => {
            setLoading(true)
            setError(undefined)
            try {
                const cred = await firebaseSignInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                setLoggedInUser(cred.user)
                return cred.user
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        },
        [auth]
    )

    return [
        signInWithEmailAndPassword,
        loggedInUser,
        loading,
        error,
        checkedAuth,
    ]
}

export default useAuth
