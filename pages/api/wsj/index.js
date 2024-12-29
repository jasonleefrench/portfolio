import { JSDOM } from 'jsdom'

// const BASE = 'https://www.wsj.com'

const BASE_URL =
    'http://allesseh-api-internal-vir.content.dowjones.io/api/Articles/v1/wsj/seoId'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query
            const r = await fetch(`${BASE_URL}/${id}`)
            const json = await r.json()
            const obj = {
                kind: 'graphic',
                title: json.data.attributes.headline.text,
                timestamp: +new Date(json.data.attributes.updated_datetime_utc),
                url:
                    json.data.attributes.canonical_url ||
                    json.data.attributes.source_url,
            }
            return res.status(200).json(obj)
        } catch (error) {
            console.error('Error fetching url:', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
