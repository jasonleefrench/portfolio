import Link from 'next/link'
import Header from '../../components/header'
import { prettyDate } from '../../utils'
import { useEffect, useState } from 'react'

const tagColors = {
    quiz: '#e74c3c',
    presentation: '#2ecc71',
    data: '#f1c40f',
    whimsy: '#8e44ad',
    live: '#2c3e50',
    election: '#3498db',
    chatgpt: '#7f8c8d',
}

const Index = () => {
    const [projects, setProjects] = useState([])
    useEffect(() => {
        const getProjects = async () => {
            const res = await fetch(
                'https://105hjaar0i.execute-api.eu-north-1.amazonaws.com/projects'
            )
            const json = await res.json()
            setProjects(json)
        }
        getProjects()
    }, [])
    return (
        <div className={'wrapper'}>
            <Header title={'Projects'} />
            <h1>Projects</h1>
            <p>Stuff I have made recently</p>
            <ul className="post-list">
                {projects
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(
                        ({ url, title, timestamp, uuid, tags = [] }) =>
                            title && (
                                <li key={uuid}>
                                    <span className="post-meta">
                                        {prettyDate(timestamp)}
                                    </span>
                                    <Link href={url} as={url}>
                                        <a className="post-link">{title}</a>
                                    </Link>
                                    {tags
                                        .sort((a, b) => a.localeCompare(b))
                                        .map((tag) => (
                                            <span
                                                key={tag}
                                                className="tag"
                                                style={{
                                                    backgroundColor:
                                                        tagColors[tag],
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </li>
                            )
                    )}
            </ul>
        </div>
    )
}

Index.getInitialProps = async () => ({
    posts: await fetch(
        'https://105hjaar0i.execute-api.eu-north-1.amazonaws.com/projects'
    ),
})

export default Index
