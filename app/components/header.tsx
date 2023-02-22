import { Link } from "@remix-run/react"

export const Header: React.FC = () => {
  return (
    <header className="h-full py-2">
      <Link
        to="/"
        className="text-1xl font-extrabold tracking-tight text-slate-800 lg:text-2xl"
      >
        Hive Mind Tales
      </Link>
    </header>
  )
}
