import { useCreations } from '@lib/context/CreationsContext'
import { useRouter } from 'next/router'
import { TUrlQuery } from 'pages/[username]'

export interface IPagination {
  pageInfo: {
    hasPrevPage: boolean
    hasNextPage: boolean
  }
  onPrevPage: () => void
  onNextPage: () => void
}
export const Pagination: React.FC<IPagination> = ({
  pageInfo,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex items-center justify-center space-x-8 mx-auto">
      {pageInfo.hasPrevPage && (
        <button
          onClick={onPrevPage}
          className="flex-inline px-8 py-1.5 text-white bg-blue-600 rounded-lg hover:bg-opacity-90 active:bg-opacity-100 active:shadow-md focus:ring-4 focus:ring-blue-300"
        >
          PREV
        </button>
      )}
      {pageInfo.hasNextPage && (
        <button
          onClick={onNextPage}
          className="flex-inline px-8 py-1.5 text-white bg-blue-600 rounded-lg hover:bg-opacity-90 active:bg-opacity-100 active:shadow-md focus:ring-4 focus:ring-blue-300"
        >
          NEXT
        </button>
      )}
    </div>
  )
}
