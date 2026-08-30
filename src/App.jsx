import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <main className="page">
      <p className="eyebrow">Tonal generating systems</p>
      <h1>Build musical ideas in the browser.</h1>
      <p className="intro">
        A small React workspace for exploring harmony, notation, and generative
        composition.
      </p>
      <div className="actions">
        <NavLink className="button primary" to="/about">
          Explore the project
        </NavLink>
      </div>
    </main>
  )
}

function About() {
  return (
    <main className="page">
      <p className="eyebrow">About</p>
      <h1>A focused place for musical experiments.</h1>
      <p className="intro">
        This route is ready for the first tonal generation tools and ABCJS
        notation views.
      </p>
    </main>
  )
}

function NotFound() {
  return (
    <main className="page">
      <p className="eyebrow">404</p>
      <h1>That page has not been composed.</h1>
      <NavLink className="button primary" to="/">
        Return home
      </NavLink>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <NavLink className="brand" to="/">
          TGS
        </NavLink>
        <nav aria-label="Main navigation">
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/"
            end
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/about"
          >
            About
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
