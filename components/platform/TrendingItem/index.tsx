import {
  faExpand,
  faComment,
  faStar as fasStar,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '@lib/context/AuthContext'
import { TCreation } from '@lib/context/CreationsContext'
import { BASE_URL } from '@lib/utils'
import httpCsr from '@lib/utils/http-csr'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ActionMenu } from './ActionMenu'
import { CreationFrame } from '../CreationFrame'
import { PreviewModal } from '../PreviewModal'
import { useEffect, useState } from 'react'

interface ITrendingItem {
  creation: TCreation
}

export const TrendingItem: React.FC<ITrendingItem> = ({ creation }) => {
  const { whoAmI } = useAuth()

  const [starCount, setStarCount] = useState(creation._count.stars)
  const [starredId, setStarredId] = useState(null)

  const [previewOpen, setPreviewOpen] = useState(false)

  const handleToggleStar = async () => {
    if (whoAmI) {
      const { status, data } = await httpCsr.put('/user/toggle-star', {
        creation_id: creation.id,
        star_id: starredId,
      })

      if (status === 201) {
        setStarredId(data?.id || null)
        setStarCount(data ? starCount + 1 : starCount - 1)
      }
    } else {
      toast.error('You must be logged in to star creations.')
    }
  }

  useEffect(() => {
    const fetchStared = async () => {
      const { data, status } = await httpCsr.get(
        `/creation/is-starred?creation_id=${creation.id}`
      )
      if (status === 200) {
        setStarredId(data)
      }
    }

    whoAmI && fetchStared()
  }, [whoAmI])

  const styles = {
    meta: {
      button: `px-2 space-x-1 rounded font-semibold bg-black/5 hover:bg-black/20`,
    },
  }

  return (
    <article
      className={`group relative p-3.5 -z-0 w-full h-fit
      hover:after:inset-0 hover:after:rounded-2xl
      after:absolute after:top-7 after:left-7 after:bottom-6 after:right-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300`}
    >
      {/* Preview */}
      <div className="relative flex items-center justify-center py-[25%] w-full h-full rounded-xl overflow-hidden bg-red-500 text-white">
        <button
          onClick={() => setPreviewOpen(true)}
          className="hidden group-hover:block absolute top-0 bottom-0 right-0 w-2/5 text-2xl cursor-pointer
          after:absolute after:right-0 after:top-0 group-hover:after:inset-0 after:cursor-pointer after:z-30 after:bg-gradient-to-bl after:from-gray-900/40 after:via-transparent after:to-transparent "
        >
          <FontAwesomeIcon
            icon={faExpand}
            className="z-40 absolute top-4 right-4"
          />
        </button>
        <CreationFrame
          title={creation?.title}
          html={creation?.code_html}
          css={creation?.code_css}
          js={creation?.code_js}
        />
      </div>
      {/* Meta */}
      <div className="">
        <div className="mt-3 flex items-center">
          <Link href="/[username]" as={`/${creation?.owner?.username}`}>
            <img
              src={`${BASE_URL}/${creation?.owner?.profile?.avatar}`}
              className="w-12 rounded-lg bg-white cursor-pointer"
              alt=""
            />
          </Link>

          {/* USER */}
          <div className="flex flex-col flex-grow overflow-hidden">
            <Link
              href="/[username]/creation/[id]"
              as={`/${creation?.owner?.username}/creation/${creation?.id}`}
            >
              <h2 className="flex-1 ml-3.5 mt-0.5 text-lg font-extrabold truncate cursor-pointer hover:text-blue-600">
                {creation?.title}
              </h2>
            </Link>
            <Link href="/[username]" as={`/${creation?.owner?.username}`}>
              <h3 className="inline-block w-fit ml-3.5 text-gray-500 cursor-pointer hover:text-gray-600">
                {'@' + creation?.owner?.username}
              </h3>
            </Link>
          </div>
          {/* ACTION MENU */}
          <ActionMenu creation={creation} />
        </div>
        <div
          className={`relative left-7 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all hover:delay-300 duration-300 mt-2 -mb-1 space-x-2`}
        >
          <button onClick={handleToggleStar} className={styles.meta.button}>
            <FontAwesomeIcon
              icon={starredId ? fasStar : farStar}
              className={`${starredId ? 'text-yellow-400' : ''}`}
            />
            <span className="text-sm">{starCount}</span>
          </button>
          <button
            onClick={() => setPreviewOpen(true)}
            className={styles.meta.button}
          >
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">{creation?._count?.comments}</span>
          </button>
        </div>
        {previewOpen && (
          <PreviewModal
            creationId={creation.id}
            opened={previewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </div>
    </article>
  )
}
