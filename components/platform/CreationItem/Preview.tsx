import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

import { PreviewModal } from './PreviewModal'

interface PreviewProps {}

export const Preview: React.VFC<PreviewProps> = ({}) => {
  const [isModalActive, setIsModalActive] = useState(false)
  return (
    <>
      <div className="relative flex items-center justify-center py-[25%] w-full h-full rounded-xl overflow-hidden bg-red-500 text-white">
        <button
          onClick={() => setIsModalActive(true)}
          className="hidden group-hover:block absolute top-0 bottom-0 right-0 w-2/5 text-2xl
        after:absolute after:right-0 after:top-0 after:w-full after:h-full after:bg-gradient-to-bl after:from-gray-900/40 after:via-transparent after:to-transparent after:transition-all after:duration-300"
        >
          <FontAwesomeIcon icon={faExpand} className="z-20 absolute top-2.5 right-4" />
        </button>
        Preview
      </div>
      <PreviewModal isActive={isModalActive} onClose={() => setIsModalActive(false)} />
    </>
  )
}
