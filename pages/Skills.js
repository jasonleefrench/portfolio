import styles from '../styles/Home.module.css'

const Skills = ({ data = [] }) => (
    <section className={styles.skills} id="skills">
        <h2>Skills</h2>
        {data.map((project, key) => (
            <div key={key} className={styles.skillsHolder}>
                <p dangerouslySetInnerHTML={{ __html: project }} />
            </div>
        ))}
        <hr />
    </section>
)

export default Skills
