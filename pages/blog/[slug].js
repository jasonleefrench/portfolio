import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'
import BlockContent from '@sanity/block-content-to-react'
import FourOhFour from '../404'
import Header from '../../components/header'
import client from '../../client'
import { prettyDate } from '../../utils'

const urlFor = source => imageUrlBuilder(client).image(source)

const serializers = {
  types: {
    code: props => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
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

const Post = ({ title = '404', published = '', body = [] }) => (
  <div className="wrapper">
    <Header title={title} />
    {body.length ?
      <article className="post">
        <h1 className="post-title">{title}</h1>
        <p className="post-meta">{prettyDate(published)}</p>
        <BlockContent
          blocks={body}
          imageOptions={{ fit: 'max' }}
          serializers={serializers}
          {...client.config()}
        />
        <p className="end">✨</p>
      </article> :
      <FourOhFour></FourOhFour>}
  </div>
)

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  body,
  published
}`

Post.getInitialProps = async context => {
  const { slug = "" } = context.query
  const res = await client.fetch(query, { slug })
  return res ? res : {}
}

export default Post