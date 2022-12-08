import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Index: React.FC = () => {
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const go = () => {
    if (name)
      navigate(`/hi/${encodeURIComponent(name)}`)
  }

  const inputRef = useRef(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')
      go()
  }

  return (
    <div>
      <div className="i-carbon-campsite text-4xl inline-block" />
      <p>
        <a
          rel="noreferrer"
          href="https://github.com/antfu/vitesse-lite"
          target="_blank"
        >
          Vitesse React
        </a>
      </p>
      <p>
        <em className="text-sm op75">Opinionated Vite Starter Template</em>
      </p>

      <div className="py-4" />

      <input
        ref={inputRef}
        placeholder={'What\'s your name?'}
        className="px-4 py-2 w-250px bg-transparent text-center"
        uno-border="~ rounded gray-200 dark:gray-700"
        uno-outline="none active:none"
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />

      {/* <TheInput
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    /> */}

      <div>
        <button
          className="m-3 text-sm btn"
          disabled={!name}
          onClick={go}
          // :disabled="!name"
          // @click="go"
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default Index
