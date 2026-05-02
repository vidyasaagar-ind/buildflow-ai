import { useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Button from '../ui/Button'
import Card from '../ui/Card'
import StageCompletionCard from './StageCompletionCard'

function StageChatPanel({
  stage,
  stageIndex,
  totalStages,
  answer,
  messages,
  isThinking,
  isStageComplete,
  isPreviewMode,
  onAnswerChange,
  onSend,
  onContinue,
  onOpenOutputs,
  onOpenPrompts,
}) {
  if (stageIndex === 6) {
    return <StageCompletionCard onOpenOutputs={onOpenOutputs} onOpenPrompts={onOpenPrompts} />
  }

  const messagesRef = useRef(null)
  const messagesEndRef = useRef(null)
  const streamIntervalRef = useRef(null)
  const streamedMessageKeyRef = useRef('')
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const streamResponse = (text, messageKey) => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }

    setIsStreaming(true)
    setStreamingText('')

    const words = text.split(' ')
    let index = 0

    streamIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        setStreamingText((prev) => (prev ? `${prev} ${words[index]}` : words[index]))
        index += 1
      } else {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
        setIsStreaming(false)
        streamedMessageKeyRef.current = messageKey
      }
    }, 30)
  }

  useEffect(() => {
    if (!messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking, isStreaming, streamingText])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'assistant') return

    const messageKey = `${messages.length}-${lastMessage.content}`

    if (isPreviewMode) {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
      }
      setIsStreaming(false)
      setStreamingText('')
      streamedMessageKeyRef.current = messageKey
      return
    }

    if (streamedMessageKeyRef.current === messageKey || isThinking) return
    streamResponse(lastMessage.content, messageKey)

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [messages, isPreviewMode, isThinking])

  return (
    <Card className="flex h-[calc(100vh-220px)] min-h-[560px] flex-col space-y-0 p-0 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h3 className="px-5 pt-5 text-lg font-semibold">{stage.title}</h3>
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Stage {stageIndex} of {totalStages}
        </span>
      </div>

      <div ref={messagesRef} className="mt-4 flex-1 overflow-y-auto border-y border-slate-200 bg-slate-50 px-6 py-6 space-y-6 dark:border-slate-800 dark:bg-slate-900/40">
        {messages.map((message, index) => (
          (() => {
            const isStreamingTarget = message.role === 'assistant' && index === messages.length - 1 && isStreaming
            const content = isStreamingTarget ? streamingText : message.content
            return (
          <ChatMessage
            key={`${message.role}-${index}`}
            role={message.role}
            content={content}
            isPreviewMode={isPreviewMode}
            isLastMessage={index === messages.length - 1 && !isStreaming}
          />
            )
          })()
        ))}

        {isThinking ? (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] md:max-w-[60%] break-words whitespace-pre-wrap bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              <p className="animate-pulse">AI is thinking...</p>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <ChatInput
          value={answer}
          onChange={onAnswerChange}
          onSubmit={onSend}
          disabled={isThinking || isStreaming}
          placeholder="Share your project details. Press Enter to send, Shift+Enter for new line."
        />
        {isStreaming ? <p className="mt-2 text-xs text-gray-400">AI is typing...</p> : null}
      </div>

      <div className="flex flex-wrap justify-end gap-2 px-5 pb-5">
        {stageIndex < totalStages && isStageComplete ? (
          <Button type="button" onClick={onContinue}>
            Continue to Next Stage
          </Button>
        ) : null}
      </div>
    </Card>
  )
}

export default StageChatPanel
