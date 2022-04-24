import { useCreations } from '@lib/context/CreationsContext'
import { useRouter } from 'next/router'
import { TUrlQuery } from 'pages/[username]'
import { CreationItem } from '../CreationItem'
import { Pagination } from '../Pagination'

export const CreationList: React.FC<any> = () => {
  const router = useRouter()
  const { username, page_num = 1, tab } = router.query as TUrlQuery

  const {
    page: { creations, ...rest },
  } = useCreations()

  const handleChangePage = (operate: 'NEXT' | 'PREV') => {
    if (operate === 'NEXT' && page_num) {
      router.push(`/${username}?tab=${tab}&page_num=${Number(page_num) + 1}`)
    } else {
      router.push(`/${username}?tab=${tab}&page_num=${Number(page_num) - 1}`)
    }
  }

  return (
    <>
      <div className={`grid row-start-1 col-start-1 grid-cols-2 grid-rows-2 gap-4`}>
        {creations &&
          creations.map(
            (item, index) =>
              item && <CreationItem creation={{ ...item }} key={index} />
          )}
      </div>
      {creations.length ? (
        <Pagination
          pageInfo={{ ...rest }}
          onPrevPage={() => handleChangePage('PREV')}
          onNextPage={() => handleChangePage('NEXT')}
        />
      ) : null}
    </>
  )
}
