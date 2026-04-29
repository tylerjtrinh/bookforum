import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home({ posts }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  const filtered = posts
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes
      return new Date(b.created_at) - new Date(a.created_at)
    })

  function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp + 'Z')) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (seconds < 3600) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    const hours = Math.floor(seconds / 3600)
    if (seconds < 86400) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    const days = Math.floor(seconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }

  return (
    <div className="page">
      <div className="feed-header">
        <h1>Book Reviews</h1>
        <div className="feed-controls">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 && <p className="empty">No posts yet. Be the first to post a review!</p>}

      {filtered.map(post => (
        <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
          <p className="time">Posted {timeAgo(post.created_at)}</p>
          {post.tagline && <p className="tagline">{post.tagline}</p>}
          <h2>{post.title}</h2>
          <p className="upvotes">{post.upvotes} upvotes</p>
        </div>
      ))}
    </div>
  )
}

export default Home