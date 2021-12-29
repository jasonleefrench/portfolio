import Image from 'next/image'
import blur from '../components/blur'
import styles from '../styles/Home.module.css'

const Components = {
    text: __html => <p dangerouslySetInnerHTML={{ __html }} />,
    image: (src, classes, alt) => {
        const extraClasses = classes.split(' ')
        const extraClassName = `${extraClasses
            .map(name => styles[name])
            .join(' ')}`
        return (
            <div className={`${styles.bgWrap} ${extraClassName}`}>
                <Image
                    src={src}
                    layout="fill"
                    blurDataURL={`data:image/svg+xml;base64,${blur(540, 475)}`}
                    objectFit="contain"
                    quality={100}
                    alt={alt}
                    placeholder="blur"
                />
            </div>
        )
    },
}

const Project = ({ project, index }) => (
    <div key={index}>
        <h3>
            {project.link ? (
                <a href={project.link}>{project.title}</a>
            ) : (
                project.title
            )}
        </h3>
        {project.description.map(
            ({ type, value, classes = '', alt = '' }, key) => (
                <div key={key}>{Components[type](value, classes, alt)}</div>
            )
        )}
        <hr />
    </div>
)

const Projects = ({ data = [] }) => (
    <section className={styles.projects}>
        <h2>Projects</h2>
        {data.map((project, index) => (
            <Project project={project} index={index} key={index} />
        ))}
    </section>
)

export default Projects
