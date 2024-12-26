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
        const { limit = 10, lastDocId } = req.query

        try {
            let query = db
                .collection('projects')
                .orderBy('timestamp', 'desc')
                .limit(Number(limit))
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

            res.status(200).json({ projects, nextCursor })
        } catch (error) {
            console.error('Error fetching projects:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
