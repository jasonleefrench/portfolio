import styles from '../styles/Home.module.css'
import Image from 'next/image'

const Socials = ({ data = [] }) => (
    <section className={styles.socials}>
        <h2>Contact me</h2>
        <div className={styles.holder}>
            {data.map(({ image, link, alt }, key) => (
                <a key={key} href={link}>
                    <Image
                        loading="eager"
                        src={image}
                        alt={alt}
                        width={48}
                        height={40}
                    />
                </a>
            ))}
        </div>
    </section>
)

export default Socials
