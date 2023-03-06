import { Link } from "@remix-run/react"

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 z-50 flex h-14 items-center justify-between bg-yellow-50 py-2">
      <Link
        to="/"
        className="text-1xl font-extrabold tracking-tight text-slate-800 lg:text-2xl"
      >
        Hive Mind Tales
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/recent">Recent</Link>
          </li>
          <li>
            <Link to="/top-rated">Top Rated</Link>
          </li>
          <li>
            <Link to="/account/stories">My Stories</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
