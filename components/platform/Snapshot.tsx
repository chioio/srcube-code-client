import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faComment } from '@fortawesome/free-regular-svg-icons'

export const Snapshot: React.VFC<any> = () => {
  return (
    <article
      className="group relative p-4 z-0 w-full
      hover:after:inset-0 hover:after:rounded-xl
      after:absolute after:top-8 after:left-4 after:right-0 after:bottom-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300"
    >
      {/* <div className="p-4"> */}
      <div className="flex items-center justify-center p-[28%] w-full h-[80%] rounded-xl bg-red-500 text-white cursor-pointer">
        Preview
      </div>
      <div className="pl-4 h-[20%]">
        <div className="flex items-center justify-between ">
          <h2 className="mt-0.5 text-lg font-bold">Information</h2>
          <button className="w-8 h-8 text-lg text-black/30 hover:text-black rounded-full active:bg-black/5">
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </div>
        <div className="space-x-1">
          <button className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5">
            <FontAwesomeIcon icon={fasStar} className="text-yellow-400" />
            <span className="text-sm">10</span>
          </button>
          <button className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5">
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">4</span>
          </button>
        </div>
      </div>
      {/* </div> */}
    </article>
  )
}
