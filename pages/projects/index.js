import Link from 'next/link'
import Header from '../../components/header'
import { prettyDate } from '../../utils'
import { useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'
import loader from '../../components/loader'

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
    const [cursor, setCursor] = useState('')
    const [hasMore, setHasMore] = useState(true)
    useEffect(() => {
        getData(update)
    }, [])
    function update(data) {
        setProjects((prev) => [...prev, ...data.projects])
        setCursor(data.nextCursor)
        setHasMore(!!data.nextCursor)
    }
    return (
        <div className={'wrapper'}>
            <Header title={'Projects'} />
            <h1>Projects</h1>
            <p>Stuff I have made recently</p>
            <ul className="post-list">
                <InfiniteScroll
                    dataLength={projects.length}
                    next={() => getData(update, cursor)}
                    hasMore={hasMore}
                    loader={
                        <img style={{ height: 100 }} src={loader('#8e44ad')} />
                    }
                >
                    {projects
                        ?.sort((a, b) => b.timestamp - a.timestamp)
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
                </InfiniteScroll>
            </ul>
        </div>
    )
}

const getData = async (callback, cursor = '') => {
    const res = await fetch(`/api/projects?lastDocId=${cursor}`)
    const json = await res.json()
    callback(json)
}

export default Index
