import { useState } from 'react'

import { faComment, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Action } from './Action'
import Link from 'next/link'
import { PreviewModal } from './PreviewModal'

interface ContentProps {}

export const Content: React.VFC<ContentProps> = () => {
  const [isModalActive, setIsModalActive] = useState(false)

  const handleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log('star!')
  }

  return (
    <>
      <div className="pl-3.5">
        <div className="flex items-center justify-between ">
          <Link href="/coding">
            <h2 className="flex-1 mt-0.5 text-lg font-bold cursor-pointer hover:text-blue-600">Title</h2>
          </Link>
          <Action />
        </div>
        <div className="space-x-1">
          <button onClick={handleStar} className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            <span className="text-sm">10</span>
          </button>
          <button
            onClick={() => setIsModalActive(true)}
            className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5"
          >
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">4</span>
          </button>
        </div>
      </div>
      <PreviewModal isActive={isModalActive} onClose={() => setIsModalActive(false)} />
    </>
  )
}
