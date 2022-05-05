import Link from 'next/link'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComment,
  faExpand,
  faStar as fasStar,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { useAuth } from '@lib/context/AuthContext'
import httpCsr from '@lib/utils/http-csr'
import toast from 'react-hot-toast'
import { TCreation, useCreations } from '@lib/context/CreationsContext'
import { ActionMenu, CreationFrame, PreviewModal } from '@components/platform'
import { TUrlQuery } from 'pages/[username]'
import { BASE_URL } from '@lib/utils'

export type ICreationItem = {
  creation: TCreation
}

export const CreationItem: React.FC<ICreationItem> = ({ creation }) => {
  const { whoAmI } = useAuth()

  const { dispatch } = useCreations()

  const router = useRouter()
  const { tab } = router.query as TUrlQuery

  const notWhoAmI = whoAmI?.id !== creation?.owner_id

  const handleToggleStar = async () => {
    if (whoAmI) {
      const { status, data } = await httpCsr.put('/user/toggle-star', {
        creation_id: creation.id,
        star_id: creation.stars[0]?.id || null,
      })

      if (status === 201) {
        // if in stars list, update creation list first
        if (tab === 'stars')
          dispatch({
            type: 'REMOVE_STAR',
            payload: { star_id: creation.stars[0]!.id },
          })

        // update star count and stars in pins list or creations list
        if (tab === 'pins' || tab === 'creations') {
          dispatch({
            type: 'TOGGLE_STAR',
            payload: {
              star: data,
              creation_id: creation.id,
            },
          })
        }
      }
    } else {
      toast.error('You must be logged in to star creations.')
    }
  }

  const styles = {
    meta: {
      button: `${
        notWhoAmI ? 'ml-3.5' : ''
      } px-2 space-x-1 rounded font-semibold bg-black/5 hover:bg-black/20`,
    },
  }

  return (
    <article
      className={`group relative p-3.5 -z-0 w-full h-fit
      hover:after:inset-0 hover:after:rounded-2xl
      after:absolute after:top-7 ${
        notWhoAmI
          ? 'after:left-7 after:bottom-6'
          : 'after:left-3.5 after:bottom-0'
      } after:right-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300`}
    >
      {/* Preview */}
      <div className="relative flex items-center justify-center py-[25%] w-full h-full rounded-xl overflow-hidden bg-red-500 text-white">
        <button
          onClick={() => {}}
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
          {notWhoAmI && (
            <Link href="/[username]" as={`/${creation?.owner.username}`}>
              <img
                src={`${BASE_URL}/${creation?.owner.profile.avatar}`}
                className="w-12 rounded-lg bg-white cursor-pointer"
                alt=""
              />
            </Link>
          )}
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
            {notWhoAmI && (
              <Link href="/[username]" as={`/${creation?.owner?.username}`}>
                <h3 className="inline-block w-fit ml-3.5 text-gray-500 cursor-pointer hover:text-gray-600">
                  {'@' + creation?.owner?.username}
                </h3>
              </Link>
            )}
          </div>
          {/* ACTION MENU */}
          <ActionMenu creation={creation} />
        </div>
        <div
          className={`relative left-7 ${
            notWhoAmI
              ? 'opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all hover:delay-300 duration-300 '
              : 'block'
          } mt-2 -mb-1 space-x-2`}
        >
          <button onClick={handleToggleStar} className={styles.meta.button}>
            <FontAwesomeIcon
              icon={creation?.stars.length ? fasStar : farStar}
              className={`${creation?.stars.length ? 'text-yellow-400' : ''}`}
            />
            <span className="text-sm">{creation?._count?.stars}</span>
          </button>
          <button onClick={() => {}} className={styles.meta.button}>
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">{creation?._count?.comments}</span>
          </button>
        </div>
        <PreviewModal
          creation={creation}
          opened={false}
          onClose={function (): void {}}
        />
      </div>
    </article>
  )
}
