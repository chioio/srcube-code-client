import Link from 'next/link'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { Action } from './Action'
import { Preview } from './Preview'
import { PreviewModal } from './PreviewModal'

interface CreationItemProps {
  isCommon?: boolean
}

export const CreationItem: React.VFC<CreationItemProps> = ({ isCommon = true }) => {
  const [isModalActive, setIsModalActive] = useState(false)

  const handleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log('star!')
  }

  const styles = {
    meta: {
      button: `${
        !isCommon ? 'ml-3.5' : ''
      } px-2 space-x-1 rounded font-semibold bg-black/5 hover:bg-black/20`,
    },
  }

  return (
    <article
      className={`group relative p-3.5 -z-0 w-full h-fit 
      hover:after:inset-0 hover:after:rounded-2xl 
      after:absolute after:top-7 ${
        isCommon ? 'after:left-7' : 'after:left-3.5'
      } after:right-0 after:bottom-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300`}
    >
      <Preview />
      <div className="">
        <div className="mt-3 flex items-center justify-between">
          {isCommon && (
            <Link href="/">
              <img src="https://picsum.photos/300" className="w-12 rounded-lg cursor-pointer" alt="" />
            </Link>
          )}

          <Link href="/coding">
            <h2 className="flex-1 ml-3.5 mt-0.5 text-lg font-extrabold cursor-pointer hover:text-blue-600">Untitled</h2>
          </Link>
          <Action />
        </div>
        <div
          className={`${
            isCommon ? 'relative left-7 hidden group-hover:block group-hover:left-0 transition-all delay-200 duration-300' : 'block'
          } mt-2 -mb-1 space-x-2`}
        >
          <button onClick={handleStar} className={styles.meta.button}>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            <span className="text-sm">10</span>
          </button>
          <button onClick={() => setIsModalActive(true)} className={styles.meta.button}>
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">4</span>
          </button>
        </div>
        <PreviewModal isActive={isModalActive} onClose={() => setIsModalActive(false)} />
      </div>
    </article>
  )
}
