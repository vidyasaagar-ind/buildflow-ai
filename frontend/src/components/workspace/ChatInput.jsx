import { useEffect, useRef, useState } from 'react'

function ChatInput({ value, onChange, onSubmit, disabled = false, placeholder = 'Share your stage answer...' }) {
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)
  const [input, setInput] = useState(value || '')
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    setInput(value || '')
  }, [value])

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`
  }, [input])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return undefined

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.stop()
      }
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      console.log('VOICE:', transcript)
      setInput(transcript)
      onChange(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }
  }, [onChange])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled) onSubmit()
    }
  }

  const handleMicClick = () => {
    const recognition = recognitionRef.current
    if (!recognition) {
      alert('Voice input not supported in this browser')
      return
    }
    if (disabled) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  return (
    <div className="border border-slate-300 rounded-2xl px-4 py-2 flex items-center gap-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            onChange(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          className="max-h-56 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled}
          className={`inline-flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isListening ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'
          } disabled:cursor-not-allowed disabled:opacity-60`}
          aria-label="Voice input"
          title="Voice input"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <path d="M12 17v4" />
            <path d="M9 21h6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full p-2 text-indigo-600 transition-all duration-200 hover:bg-gray-200 dark:text-indigo-300 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h12" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
      {isListening ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">Listening...</p>
      ) : null}
    </div>
  )
}

export default ChatInput
