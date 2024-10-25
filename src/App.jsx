import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import Register from './Register'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Router>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Routes>
          {/* Si no hay sesión, mostrar Auth o Register */}
          {!session ? (
            <>
              <Route path="/" element={<Auth />} />
              <Route path="/register" element={<Register />} />
            </>
          ) : (
            <Route path="/" element={<Account key={session.user.id} session={session} />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App