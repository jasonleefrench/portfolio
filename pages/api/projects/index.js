import dotenv from 'dotenv'
import admin from 'firebase-admin'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}

const db = admin.firestore()

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Handle GET /api/projects with pagination
        const { limit = 10, lastDocId, isAll = false } = req.query

        try {
            let query = db
                .collection('projects')
                .orderBy('timestamp', 'desc')
                .limit(Number(limit))

            if (isAll !== 'true') {
                query = query.where('has_image', '==', true)
            }

            if (lastDocId) {
                const lastDoc = await db
                    .collection('projects')
                    .doc(lastDocId)
                    .get()
                query = query.startAfter(lastDoc)
            }

            const snapshot = await query.get()
            const projects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            const nextCursor = snapshot.docs.length
                ? snapshot.docs[snapshot.docs.length - 1].id
                : null

            return res.status(200).json({ projects, nextCursor })
        } catch (error) {
            console.error('Error fetching projects:', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    if (req.method === 'POST') {
        const { title, kind, tags = [], timestamp, url } = req.body
        const { authorization } = req.headers

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Missing or invalid token' })
        }

        const token = authorization.split('Bearer ')[1]

        try {
            await admin.auth().verifyIdToken(token)
        } catch (e) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Invalid token' })
        }

        try {
            const docRef = await db.collection('projects').add({
                title,
                kind,
                tags,
                timestamp,
                url,
            })
            return res.status(201).json({ ok: true, id: docRef.id })
        } catch (error) {
            console.error('Error creating project:', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
