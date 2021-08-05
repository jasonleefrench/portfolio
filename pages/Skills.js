import styles from '../styles/Home.module.css'

const Skills = ({ data = [] }) => (
  <section className={styles.skills} id='skills'>
    <h2>Skills</h2>
    {data.map((project, key) => (
      <section key={key} className={styles.projects}>
        <p dangerouslySetInnerHTML={{ __html: project }} />
      </section>
    ))}
    <hr />
  </section>
)

export default Skills
