import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function PostDetail({ posts, updatePost, deletePost }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find(p => p.id === id)

  const [comment, setComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const [editTagline, setEditTagline] = useState('')
  const [editContent, setEditContent] = useState('')

  if (!post) return <p className="page empty">Post not found.</p>

  async function handleUpvote() {
    await updatePost({ ...post, upvotes: post.upvotes + 1 })
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    await updatePost({ ...post, comments: [...post.comments, comment.trim()] })
    setComment('')
  }

  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id)
      navigate('/')
    }
  }

  function startEditing() {
    setEditTitle(post.title)
    setEditAuthor(post.author || '')
    setEditTagline(post.tagline || '')
    setEditContent(post.content || '')
    setIsEditing(true)
  }

  async function handleEdit(e) {
    e.preventDefault()
    await updatePost({ ...post, title: editTitle.trim(), author: editAuthor.trim(), tagline: editTagline.trim(), content: editContent.trim() })
    setIsEditing(false)
  }

  return (
    <div className="page">
      {isEditing ? (
        <div className="form-card">
          <h2>Edit Post</h2>
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={editAuthor}
                onChange={e => setEditAuthor(e.target.value)}
                placeholder="e.g. Frank Herbert"
              />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                value={editTagline}
                onChange={e => setEditTagline(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Review</label>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="btn-row">
              <button className="btn btn-primary" type="submit">Save Changes</button>
              <button className="btn btn-secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="post-detail">
          {post.image && <img src={post.image} alt={post.title} />}
          <h1>{post.title}</h1>
          {post.author && <p style={{ color: 'var(--brown-light)', marginBottom: '0.5rem' }}>by {post.author}</p>}
          {post.tagline && <p className="tagline">{post.tagline}</p>}
          {post.content && <p className="content">{post.content}</p>}

          <div className="btn-row">
            <button className="btn btn-primary" onClick={handleUpvote}>⬆ Upvote ({post.upvotes})</button>
            <button className="btn btn-secondary" onClick={startEditing}>✏️ Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>🗑️ Delete</button>
          </div>

          <hr className="divider" />

          <h3>Comments</h3>
          {post.comments.length === 0 && <p className="empty">No comments yet. Start the discussion!</p>}
          {post.comments.map((c, i) => (
            <div key={i} className="comment">
              <p>{c}</p>
            </div>
          ))}

          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment..."
            />
            <button className="btn btn-primary" type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostDetail