import Link from 'next/link'
import groq from 'groq'
import Header from '../../../components/header'
import client from '../../../client'
import { prettyDate, prettyTitle } from '../../../utils'

const CategoryIndex = ({ categories = [] }) => (
  <div className={'wrapper'}>
    <Header title={'Categories'} />
    <h1>Categories</h1>
    <ul className='post-list'>
      {categories.map(
        ({ _id, title = '', slug = '', posts = [] }) => (
          <li style={{margin: '50px 0' }} key={_id}>
            <h2 className='post-link'>
              ✨✨✨ {prettyTitle(title)} ✨✨✨
            </h2>
            <ul className="list">
              {posts.map(({ title = '', slug = '', published }, index) =>
                <li key={index}>
                  <span className="post-meta">
                    {prettyDate(published)}
                  </span>
                  <Link href='/blog/[slug]' as={`/blog/${slug}`}>
                    <a>
                      <h2 className='post-link'>{title}</h2>
                    </a>
                  </Link>
                </li>
              )}
            </ul>
            <Link
              href='/blog/categories/[slug]'
              as={`/blog/categories/${slug}`}
            >
              <a><span>see more...</span></a>
            </Link>
          </li>
        )
      )}
    </ul>
  </div>
)

CategoryIndex.getInitialProps = async () => ({
  categories: await client.fetch(groq`
    *[_type == 'category']{
      'posts': *[_type=='post' && references(^._id)]{
        title, 'slug': slug.current, published
      }[0..5] | order(_createdAt asc),
      _id,
      title,
      'slug': slug.current,
    }
  `)
})

export default CategoryIndex