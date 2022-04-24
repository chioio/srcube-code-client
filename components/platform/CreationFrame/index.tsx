type TDoc = {
  title?: string
  html?: string
  css?: string
  js?: string
}

export const CreationFrame: React.FC<TDoc> = ({ title, html, css, js }) => {
  
  return (
    <iframe
      title={title}
      className="absolute top-0 bottom-0 left-0 right-0 w-[calc(200%)] h-[calc(200%)] min-h-[15rem] origin-top-left scale-50 bg-white"
      srcDoc={doc({ title, html, css, js })}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
    />
  )
}

const doc = ({ title, html, css, js }: TDoc) => `
<html>
  <title>${title}</title>
  <style id="_style">${css}</style>
  <script type="module" id="_script">
  ${js}
  </script>
  <body>
  ${html}
  </body>
</html>`
