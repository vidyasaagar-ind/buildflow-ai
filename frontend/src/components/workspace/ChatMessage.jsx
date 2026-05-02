function ChatMessage({ role, content, isPreviewMode = false, isLastMessage = false }) {
  const isUser = role === 'user'
  const bubbleClass = `
    px-4 py-3 rounded-2xl text-sm leading-relaxed
    max-w-[75%] md:max-w-[60%]
    break-words whitespace-pre-wrap
    transition-opacity duration-200
    ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
  `

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={bubbleClass}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

export default ChatMessage
