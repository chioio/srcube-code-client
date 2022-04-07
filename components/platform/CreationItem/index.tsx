import Link from 'next/link'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { Action } from './Action'
import { Preview } from './Preview'
import { PreviewModal } from './PreviewModal'
import { CreationEdge } from '@lib/api/schema'
import { useQuery } from '@apollo/client'
import { GET_USER_AVATAR_QUERY } from '@lib/api/queries'

interface CreationItemProps {
  isCommon?: boolean
  creation: CreationEdge
}

export const CreationItem: React.VFC<CreationItemProps> = ({ isCommon = true, creation }) => {
  const [isModalActive, setIsModalActive] = useState(false)

  console.log(creation.node.author)

  const { data } = useQuery(GET_USER_AVATAR_QUERY, { variables: { username: creation.node.author } })

  const handleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log('star!')
  }

  const styles = {
    meta: {
      button: `${!isCommon ? 'ml-3.5' : ''} px-2 space-x-1 rounded font-semibold bg-black/5 hover:bg-black/20`,
    },
  }

  return (
    <article
      className={`group relative p-3.5 -z-0 w-full h-fit
      hover:after:inset-0 hover:after:rounded-2xl
      after:absolute after:top-7 ${
        isCommon ? 'after:left-7 after:bottom-6' : 'after:left-3.5 after:bottom-0'
      } after:right-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300`}
    >
      <Preview creation={creation?.node} />
      <div className="">
        <div className="mt-3 flex items-center justify-between">
          {isCommon && (
            <Link href="/">
              <img src={data?.user.avatar} className="w-12 rounded-lg bg-white cursor-pointer" alt="" />
            </Link>
          )}
          <Link href="/coding">
            <h2 className="flex-1 ml-3.5 mt-0.5 text-lg font-extrabold cursor-pointer hover:text-blue-600">Untitled</h2>
          </Link>
          <Action />
        </div>
        <div
          className={`${
            isCommon
              ? 'relative left-7 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all delay-75 duration-500'
              : 'block'
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
