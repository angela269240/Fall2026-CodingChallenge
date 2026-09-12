import {
  Compass,
  FolderHeart
} from 'lucide-react'

function Navbar() {
  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={goHome}
        aria-label="Go to home page"
      >
        <span className="brand-mark">
          C
        </span>

        <span>Curate</span>
      </button>

      <nav className="nav-links">
        <button onClick={goHome}>
          <Compass size={18} />
          Discover
        </button>

        <button
          onClick={() => {
            window.location.href = '/#collections'
          }}
        >
          <FolderHeart size={18} />
          Collections
        </button>
      </nav>
    </header>
  )
}

export default Navbar