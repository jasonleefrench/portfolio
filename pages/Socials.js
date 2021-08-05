import styles from '../styles/Home.module.css'
import Image from 'next/Image'

const Socials = ({ data = [] }) => (
  <section className={styles.socials}>
    <h2>Contact me</h2>
    <div className={styles.holder}>
      {data.map(({ image, link, alt }, key) => (
        <a key={key} href={link}>
          <Image src={image} alt={alt} />
        </a>
      ))}
    </div>
  </section>
)

export default Socials
