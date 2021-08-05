import styles from '../styles/Home.module.css'
import Greeter from '../components/greeter'
import ScrollTo from '../components/scrollTo'

const Components = {
  text: (__html, index) => (
    <p
      key={index}
      className={styles.description}
      dangerouslySetInnerHTML={{__html}}
    />
  ),
  scrollTo: ({ selector, text }, index) => <ScrollTo
    key={index}
    element={
      typeof document !== 'undefined' && document.querySelector(selector)
    }
    text={text}
  />,
  greeter: ({ text }) => <Greeter text={text} />
}

const Intro = ({ data = {} }) => (
  <section className={styles.intro}>
    <h1 className={styles.title}>
      {Components[data?.header?.type || 'text'](data.header)}
    </h1>
    {data.descriptions?.map((description, index) =>
      Components[description.type || 'text'](description, index)
    )}
  </section>
)

export default Intro