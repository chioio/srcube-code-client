import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

import { PreviewModal } from './PreviewModal'
import { Creation } from '@lib/api/schema'

interface PreviewProps {
  creation: Creation
}

export const Preview: React.VFC<PreviewProps> = ({ creation }) => {
  const [isModalActive, setIsModalActive] = useState(false)
  return (
    <>
      <div className="relative flex items-center justify-center py-[25%] w-full h-full rounded-xl overflow-hidden bg-red-500 text-white">
        <button
          onClick={() => setIsModalActive(true)}
          className="hidden group-hover:block absolute top-0 bottom-0 right-0 w-2/5 text-2xl cursor-pointer
          after:absolute after:right-0 after:top-0 group-hover:after:inset-0 after:cursor-pointer after:z-30 after:bg-gradient-to-bl after:from-gray-900/40 after:via-transparent after:to-transparent "
        >
          <FontAwesomeIcon icon={faExpand} className="z-40 absolute top-4 right-4" />
        </button>
        <iframe
          title={creation.title}
          className="absolute top-0 bottom-0 left-0 right-0 w-[calc(200%+5px)] h-[calc(200%+5px)] min-h-[15rem] origin-top-left scale-50 bg-white border"
          srcDoc={`<html class="dark:bg-black dark:text-white">
            <title>${creation.title}</title>
            <style id="_style">${creation.code.css}</style>
            <script type="module" id="_script">
              ${creation.code.javascript}
            </script>
            <body>
              ${creation.code.html}
            </body>
          </html>
          `}
          sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
        />
      </div>
      {isModalActive && (
        <PreviewModal isActive={isModalActive} creationId={creation._id} onClose={() => setIsModalActive(false)} />
      )}
    </>
  )
}
