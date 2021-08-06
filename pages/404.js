import Link from 'next/link'

const FourOhFour = () => (
  <div class="container">
    <h1>404</h1>
    <p><strong>Page not found 😞</strong></p>
    <p>Let's <Link href="/">go home</Link>.</p>
  </div>
)

export default FourOhFour