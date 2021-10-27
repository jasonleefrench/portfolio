import groq from "groq"
import Link from 'next/link'
import FourOhFour from "../../404"
import Header from "../../../components/header"
import client from "../../../client"
import { prettyDate, prettyTitle } from "../../../utils"

const Category = ({
  title = "404", posts = []
}) => (
  <div className="wrapper">
    <Header title={title} />
    <h1 className="post-title">Category: {prettyTitle(title)}</h1>
    <ul className="list">
      {posts.map(({ _id, title, slug, published }) => (
        <li key={_id}>
          <span className="post-meta">{prettyDate(published)}</span>
          <Link href={`/blog/${slug}`}>
            <a>
              <h2 className="post-link">{title}</h2>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const categoryQuery =
  groq`*[_type == "category" && slug.current == $category][0]{
    title,
    'slug': slug.current,
    'posts': *[_type=='post' && references(^._id)]{
      title,
      published,
      'slug': slug.current,
      _id
    }
  }`

Category.getInitialProps = async context => {
  const { category = "" } = context.query
  const res = await client.fetch(categoryQuery, { category })
  return res || {}
}

export default Category