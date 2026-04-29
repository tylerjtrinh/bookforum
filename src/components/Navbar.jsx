import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">BookTalk</Link>
      <Link to="/create">+ New Post</Link>
    </nav>
  )
}

export default Navbar