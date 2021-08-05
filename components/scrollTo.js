import styles from '../styles/Home.module.css'

const ScrollTo = ({ element, text }) => {
  const top = element.offsetTop
  const scrollTo = () => window.scrollTo({ top, behavior: 'smooth' })
  const clickable = text.match(/{(\w+)}/)[1]
  const child = <span onClick={scrollTo}>{clickable}</span>
  return <p className={styles.description}>
    {text.split(/{(\w+)}/).map((str, index) => <span
      key={index}
      className={index === 1 ? styles.clickable : undefined}
    >
      {index === 1 ? child : str}
    </span>)}
  </p>
}

export default ScrollTo