import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreatePost({ addPost }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [tagline, setTagline] = useState('')
  const [content, setContent] = useState('')
  const [useCover, setUseCover] = useState(false)
  const [loading, setLoading] = useState(false)

  async function fetchBookCover(bookTitle, bookAuthor) {
    const formattedTitle = bookTitle.trim().replace(/\s+/g, '+')
    const formattedAuthor = bookAuthor.trim().replace(/\s+/g, '+')
    const query = bookAuthor
      ? `title=${formattedTitle}&author=${formattedAuthor}`
      : `title=${formattedTitle}`
    const url = `https://openlibrary.org/search.json?${query}&limit=1`
    const res = await fetch(url)
    const data = await res.json()
    if (data.docs && data.docs.length > 0) {
      const coverId = data.docs[0].cover_i
      if (coverId) {
        return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      }
    }
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const coverUrl = useCover ? await fetchBookCover(title, author) : ''
    const newPost = {
      title: title.trim(),
      author: author.trim(),
      tagline: tagline.trim(),
      content: content.trim(),
      image: coverUrl,
      upvotes: 0,
      comments: [],
    }
    await addPost(newPost)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Create a Book Review</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Dune"
              required
            />
          </div>
          <div className="form-group">
            <label>Author <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}></span></label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. Frank Herbert"
            />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g. This book is amazing"
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useCover}
                onChange={e => setUseCover(e.target.checked)}
              />
              Use book cover image
            </label>
          </div>
          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your review here..."
              rows={6}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Fetching cover & posting...' : 'Post Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost