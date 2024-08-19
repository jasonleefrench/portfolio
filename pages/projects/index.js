import Link from 'next/link'
import groq from 'groq'
import Header from '../../components/header'
import client from '../../client'
import { prettyDate } from '../../utils'
import { useEffect, useState } from 'react'

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
                        ({ url, title, timestamp, uuid }) =>
                            title && (
                                <li key={uuid}>
                                    <span className="post-meta">
                                        {prettyDate(timestamp)}
                                    </span>
                                    <Link href={url} as={url}>
                                        <a className="post-link">{title}</a>
                                    </Link>
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
