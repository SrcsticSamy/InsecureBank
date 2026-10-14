import React, { useState, useEffect } from 'react'

const CORRUPT_TOKENS = [
  '0x7F4A_ERR',
  'SEGFAULT',
  'NULL_PTR',
  '[REDACTED]',
  '0x00000000',
  'MEM_CORRUPT',
  'STACK_OVERFLOW',
]

interface GlitchTextProps {
  text: string
  className?: string
  as?: React.ElementType
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  useEffect(() => {
    // Schedule a glitch every 14 to 28 seconds
    let glitchTimeout: ReturnType<typeof setTimeout>
    let revertTimeout: ReturnType<typeof setTimeout>

    const scheduleNextGlitch = () => {
      const delay = Math.floor(Math.random() * (28000 - 14000 + 1)) + 14000
      glitchTimeout = setTimeout(() => {
        // Corrupt 1 random word
        const words = text.split(' ')
        if (words.length > 0) {
          const randomIndex = Math.floor(Math.random() * words.length)
          const randomToken = CORRUPT_TOKENS[Math.floor(Math.random() * CORRUPT_TOKENS.length)]
          const corrupted = [...words]
          corrupted[randomIndex] = randomToken
          setDisplayText(corrupted.join(' '))
          setIsGlitching(true)

          // Revert after 160ms
          revertTimeout = setTimeout(() => {
            setDisplayText(text)
            setIsGlitching(false)
            scheduleNextGlitch()
          }, 160)
        } else {
          scheduleNextGlitch()
        }
      }, delay)
    }

    scheduleNextGlitch()

    return () => {
      clearTimeout(glitchTimeout)
      clearTimeout(revertTimeout)
    }
  }, [text])

  return (
    <Component className={`${className} ${isGlitching ? 'glitch-active' : ''}`}>
      {displayText}
    </Component>
  )
}
