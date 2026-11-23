import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" end>about</NavLink>
      <NavLink to="/projects">projects</NavLink>
      <NavLink to="/writing">writing</NavLink>
      <NavLink to="/cabinet">cabinet</NavLink>
    </nav>
  )
}