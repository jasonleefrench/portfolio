import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Img = ({ src, alt = '' }) => (
    <div className={styles.imageHolder}>
        <Image
            src={src}
            layout="fill"
            objectFit="contain"
            quality={100}
            alt={alt}
        />
    </div>
)

const Text = ({ project }) => (
    <div className={styles.textHolder}>
        <h3>
            {project.link ? (
                <a href={project.link}>{project.title}</a>
            ) : (
                project.title
            )}
        </h3>
        <h4 className={styles.date}>{project.date}</h4>
        {project.meta?.length &&
            project.meta.map((str, key) => <h4 key={key}>{str}</h4>)}
        {project.description.text.map((__html, key) => (
            <p key={key} dangerouslySetInnerHTML={{ __html }} />
        ))}
    </div>
)

const Project = ({ project, index }) => {
    const Left =
        index % 2 ? (
            <Text project={project} />
        ) : (
            <Img src={project.description.image} />
        )
    const Right =
        index % 2 ? (
            <Img src={project.description.image} />
        ) : (
            <Text project={project} />
        )
    return (
        <div className={`${styles.project} ${index % 2 ? styles.reverse : ''}`}>
            {Left}
            {Right}
        </div>
    )
}

const Projects = ({ data = [] }) => (
    <section className={styles.projects}>
        {data.map((project, index) => (
            <Project project={project} index={index} key={index} />
        ))}
    </section>
)

export default Projects
