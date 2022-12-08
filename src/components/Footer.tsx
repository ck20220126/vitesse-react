import { useEffect } from 'react'
import useDark from '~/hooks/useDark'

const Footer: React.FC = () => {
  const [isDark, toggle] = useDark()

  useEffect(() => {
    console.log('<Footer> isDark:', isDark)
  }, [isDark])

  return (
    <nav className="mt-6 flex justify-center gap-2 text-xl">
      <button className="icon-btn" onClick={toggle}>
        <div className="dark:i-carbon-moon cafe:i-carbon-cafe i-carbon-sun" />
      </button>
      <a
        className="icon-btn i-carbon-logo-github"
        rel="noreferrer"
        href="https://github.com/ck20220126/vitesse-react"
        target="_blank"
        title="GitHub"
      />
    </nav>
  )
}

export default Footer
