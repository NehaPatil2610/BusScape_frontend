import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p className="not-found-label">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to home</Link>
    </main>
  )
}
