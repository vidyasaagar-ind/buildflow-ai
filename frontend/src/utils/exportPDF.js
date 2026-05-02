export function exportMarkdownAsPDF({ title, content }) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=800')
  if (!printWindow) return false

  const escapedTitle = (title || 'Document').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escapedContent = (content || 'No content generated yet.')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapedTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
          h1 { margin-bottom: 16px; font-size: 24px; }
          pre { white-space: pre-wrap; font-family: Consolas, monospace; line-height: 1.45; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${escapedTitle}</h1>
        <pre>${escapedContent}</pre>
      </body>
    </html>
  `)
  printWindow.document.close()

  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 120)

  return true
}
