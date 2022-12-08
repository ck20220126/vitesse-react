import { Suspense, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'

import Footer from '~/components/Footer'

function App() {
  const [enable, setEnable] = useState(false)
  function init() {
    if (enable)
      setEnable(val => !val)
  }

  init()
  return (
    <main className='px-4 py-10 text-center'>
      <Suspense fallback={<p>Loading...</p>}>
        {useRoutes(routes)}
      </Suspense>
      <Footer />
    </main>
  )
}

export default App
