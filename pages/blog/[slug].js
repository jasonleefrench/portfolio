import { useEffect } from "react"
import groq from "groq"
import imageUrlBuilder from "@sanity/image-url"
import Script from 'next/script'
import BlockContent from "@sanity/block-content-to-react"
import FourOhFour from "../404"
import Header from "../../components/header"
import client from "../../client"
import { prettyDate } from "../../utils"

const urlFor = source => imageUrlBuilder(client).image(source)

const getReadingTime = body => {
  const wordCount = getWordCount(body)
  const minutes = Math.floor(wordCount / 200)
  return minutes < 1 ? `Less than 1 minute` :
   minutes === 1 ? `${minutes} minute` :
   `${minutes} minutes`
}

const getWordCount = blocks => blocks.reduce((acc, item) => {
  if(item.children) {
    return acc + getWordCount(item.children)
  }
  return item.text ? acc + item.text.split(' ').length : acc
}, 0)

const serializers = {
  types: {
    code: props => (
      <pre>
        <code className={`language-${props.node.language}`}>
          {props.node.code}
        </code>
      </pre>
    ),
    script: props => (
      <script dangerouslySetInnerHTML={{__html: props.node.script }} />
    ),
    div: props => (
      <div id={props.node.id}></div>
    )
  }
}

const SiblingLink = ({ type, title, slug }) => (
  <p>{type} post: <a href={slug}>{title}</a></p>
)

const Post = ({ title = "404", published = "", body = [], siblings = [] }) => (
    <div className="wrapper">
      <Header title={title} />
      <Script src="/js/highlight.min.js"></Script>
      {body.length ?
        <article className="post">
          <h1 className="post-title">{title}</h1>
          <p className="post-meta">{prettyDate(published)}. {getReadingTime(body)} read</p>
          <BlockContent
            blocks={body}
            imageOptions={{ fit: "max" }}
            serializers={serializers}
            {...client.config()}
          />
          <p className="end">✨💕✨</p>
          {siblings
            .filter(({ slug }) => slug)
            .map(({ type, title, slug }, index) =>
              <SiblingLink key={index} type={type} title={title} slug={slug} />
            )
          }
        </article> :
        <FourOhFour></FourOhFour>}
    </div>
  )

const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  body,
  published
}`

const siblingPostQueries = [
  {
    type: "previous",
    input: "dateTime(published) < dateTime($published)",
    order: "desc"
  },
  {
    type: "next",
    input: "dateTime(published) > dateTime($published)",
    order: "asc"
  }
].map(({ type, input, order }) => ({
  query:
    groq`*[_type == "post" && ${input}]{
      slug, title, published
    }| order(published ${order})[0]`,
  type
}))

const getSiblings = async published => await Promise.all(
  siblingPostQueries.map(
    async ({ query, type }) => {
      const res = await client.fetch(query, { published })
      return {
        slug: res?.slug?.current,
        title: res?.title,
        type
      }
    }
  )
)

Post.getInitialProps = async context => {
  const { slug = "" } = context.query
  const res = await client.fetch(postQuery, { slug })
  if(!res) { return {} }
  const siblings = await getSiblings(res.published)
  return { ...res, siblings }
}

export default Post