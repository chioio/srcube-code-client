import { useCoding } from '@lib/context/CodingContext'

type ICodingFrame = {
  title?: string
  html?: string
  css?: string
  js?: string
}

export const CodingFrame: React.VFC<ICodingFrame> = ({
  title,
  html,
  css,
  js,
}) => {
  const { creation } = useCoding()

  return (
    <iframe
      title={title}
      className="w-full h-full bg-white "
      srcDoc={doc({
        title: creation.title,
        html: creation.code_html,
        css: creation.code_css,
        js: creation.code_js,
      })}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
    />
  )
}

const doc = ({ title = '', html = '', css = '', js = '' }: ICodingFrame) => `
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
