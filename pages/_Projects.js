import { useCallback, useState } from "react"
import loader from "../components/loader"
import styles from "../styles/Home.module.css"

const LOADER_COLORS = [
  "#2980b9",
  "#27ae60",
  "#e74c3c",
  "#3498db",
  "#8e44ad",
  "#f39c12",
]

const loaderColor =
  LOADER_COLORS[Math.floor(Math.random() * LOADER_COLORS.length)]

const Video = ({ src }) => (
  <video
    autoPlay
    muted
    loop
    style={{ maxWidth: "80%", margin: "0 auto", display: "block" }}
  >
    <source src={src} type="video/webm" />
  </video>
)

const Img = ({ src, alt = "", extraClasses }) => {
  return (
    <div>
      <img style={{ maxWidth: "80%", margin: "0 auto" }} src={src} alt={alt} />
    </div>
  )
}

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
  const Element = project.description.video ? Video : Img
  const src = project.description.video || project.description.image
  const Left =
    index % 2 ? (
      <Text project={project} />
    ) : (
      <Element src={src} extraClasses={project.description.extraImageClasses} />
    )
  const Right =
    index % 2 ? (
      <Element src={src} extraClasses={project.description.extraImageClasses} />
    ) : (
      <Text project={project} />
    )
  return (
    <div className={`${styles.project} ${index % 2 ? styles.reverse : ""}`}>
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
