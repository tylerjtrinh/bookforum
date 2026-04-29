import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setPosts(data)
  }

  async function addPost(post) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
    if (error) console.error(error)
    else setPosts([data[0], ...posts])
  }

  async function deletePost(id) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    if (error) console.error(error)
    else setPosts(posts.filter(p => p.id !== id))
  }

  async function updatePost(updatedPost) {
    const { error } = await supabase
      .from('posts')
      .update(updatedPost)
      .eq('id', updatedPost.id)
    if (error) console.error(error)
    else setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/create" element={<CreatePost addPost={addPost} />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} updatePost={updatePost} deletePost={deletePost} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App