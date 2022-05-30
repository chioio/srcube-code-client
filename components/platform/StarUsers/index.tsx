import { faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BASE_URL } from '@lib/utils'
import httpCsr from '@lib/utils/http-csr'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const StarUsers: React.VFC<{ creationId?: string }> = ({
  creationId,
}) => {
  const [stars, setStars] = useState([])

  useEffect(() => {
    const fetchStars = async () => {
      console.log(creationId)
      const { data, status } = await httpCsr.get(
        '/creation/stars',
        { params: { creation_id: creationId } }
      )
      if (status === 200) {
        setStars(data)
      }
    }

    creationId && fetchStars()
  }, [creationId])

  return (
    <div className="w-full h-fit">
      <h3 className="mt-4 mb-2 space-x-2">
        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
        <span>{stars.length || 'No'} Stars</span>
      </h3>

      <div className="flex flex-wrap">
        {stars.map((item: any, index) => (
          <Link key={index} href={`http://${process.env.HOST}/${item.owner.username}`}>
            <a className="relative group m-0.5">
              <img
                src={`${BASE_URL}/${item.owner.profile.avatar}`}
                className="rounded bg-white w-8 h-8 cursor-pointer"
              />
              <div className="opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition translate-y-2 absolute top-5 -left-16 -right-16 text-center">
                <div className="px-2 inline-block text-sm space-x-1 font-medium  bg-white rounded text-black">
                  <span className="">
                    {item.owner.first_name + ' ' + item.owner.last_name}
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
