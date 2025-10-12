import { useEffect, useState, useCallback, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Header from '../../components/header'
import loader from '../../components/loader'
import GOL from '../../components/GOL'
import useAnalytics from '../../hooks/useAnalytics'
import { prettyDate } from '../../utils'
import Konami from '../../components/Konami'

const tagColors = {
    quiz: '#e74c3c',
    presentation: '#2ecc71',
    data: '#f1c40f',
    whimsy: '#8e44ad',
    live: '#2c3e50',
    election: '#3498db',
    ai: '#7f8c8d',
}

const Index = () => {
    const analytics = useAnalytics()
    const [projects, setProjects] = useState([])
    const [cursor, setCursor] = useState('')
    const [hasMore, setHasMore] = useState(true)
    const [seeAll, setSeeAll] = useState(false)
    const [golIsActive, setGolIsActive] = useState(false)
    const container = useRef(null)

    const update = useCallback(
        (data) => {
            setProjects((prev) => {
                const projectMap = new Map()
                prev.forEach((project) => projectMap.set(project.id, project))
                data.projects.forEach((project) =>
                    projectMap.set(project.id, project)
                )
                return Array.from(projectMap.values())
            })
            setCursor(data.nextCursor)
            setHasMore(!!data.nextCursor)
            analytics('projects_scroll', {
                nextCursor: data.nextCursor,
            })
        },
        [analytics]
    )

    useEffect(() => {
        setProjects([])
        setCursor('')
        setHasMore(true)
        getData(update, '', seeAll)
        analytics('projects_view')
    }, [analytics, update, seeAll])

    return (
        <div className={'wrapper'}>
            {!!projects.length && (
                <GOL screenElement={container.current} isActive={golIsActive} />
            )}
            <div
                ref={container}
                style={{
                    zIndex: 2,
                    position: 'relative',
                }}
            >
                <Header title={'Projects'} />
                <h1>Projects</h1>
                <p
                    style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                    onClick={() => setSeeAll((seeAll) => !seeAll)}
                >
                    See {seeAll ? 'my highlighted' : 'all my'} projects
                </p>
                <ul className="post-list">
                    <InfiniteScroll
                        dataLength={projects.length}
                        next={() => getData(update, cursor, seeAll)}
                        hasMore={hasMore}
                        loader={
                            <img
                                style={{ height: 100 }}
                                src={loader('#8e44ad')}
                            />
                        }
                        style={{ overflow: 'visible' }}
                    >
                        {projects
                            ?.sort((a, b) => b.timestamp - a.timestamp)
                            .map(
                                (
                                    {
                                        url,
                                        title,
                                        timestamp,
                                        description,
                                        uuid,
                                        tags = [],
                                        has_image,
                                    },
                                    i
                                ) =>
                                    title && (
                                        <li
                                            key={`${uuid}-${seeAll}-${i}`}
                                            className={`${
                                                !seeAll && has_image
                                                    ? 'has-image'
                                                    : ''
                                            }`}
                                        >
                                            <div>
                                                <span className="post-meta">
                                                    {prettyDate(timestamp)}
                                                </span>
                                                <Link href={url} as={url}>
                                                    <a className="post-link">
                                                        {title}
                                                    </a>
                                                </Link>
                                                {tags
                                                    .sort((a, b) =>
                                                        a.localeCompare(b)
                                                    )
                                                    .map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="tag"
                                                            style={{
                                                                backgroundColor:
                                                                    tagColors[
                                                                        tag
                                                                    ],
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                            {has_image && !seeAll && (
                                                <img
                                                    src={`/images/${uuid}.png`}
                                                />
                                            )}
                                            {!seeAll && (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: description,
                                                    }}
                                                />
                                            )}
                                        </li>
                                    )
                            )}
                    </InfiniteScroll>
                </ul>
            </div>
            <Konami
                isActive={golIsActive}
                callback={() => setGolIsActive(() => !golIsActive)}
            />
        </div>
    )
}

const getData = async (callback, cursor = '', isAll = false) => {
    const res = await fetch(`/api/projects?lastDocId=${cursor}&isAll=${isAll}`)
    const json = await res.json()
    callback(json)
}

export default Index
