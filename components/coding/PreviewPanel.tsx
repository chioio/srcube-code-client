import { creationState } from '@lib/store/atoms'
import { useRecoilValue } from 'recoil'

interface PreviewPanelProps {}

export const PreviewPanel: React.VFC<PreviewPanelProps> = () => {
  const creation = useRecoilValue(creationState)

  return (
    <iframe
      title={creation?.title}
      className="w-full h-full bg-white "
      srcDoc={generateHtmlDoc({ ...creation, ...creation?.code })}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
    />
  )
}

const generateHtmlDoc = ({ title, html, css, javascript }: Record<string, any>) => {
  return `
    <html class="dark:bg-black dark:text-white">
      <title>${title}</title>
      <style id="_style">${css}</style>
      <script type="module" id="_script">
        ${javascript}
      </script>
      <body>
        ${html}
      </body>
    </html>`
}
