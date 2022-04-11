import { gql, useLazyQuery } from '@apollo/client'
import { faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Star } from '@lib/api/schema'
import { HOSTNAME } from '@lib/constants'
import Link from 'next/link'
import { useEffect } from 'react'

type GetStarsVariables = {
  creationId: string
}

type GetStarsOutput = {
  stars: Star[]
}

const GET_STARS_QUERY = gql`
  query GetStarsQuery($creationId: String!) {
    stars(creationId: $creationId) {
      _id
      user {
        title
        avatar
        username
      }
    }
  }
`

export const StarUsers: React.VFC<{ creationId?: string }> = ({ creationId }) => {
  const [getStars, { data }] = useLazyQuery<GetStarsOutput, GetStarsVariables>(GET_STARS_QUERY, {
    variables: { creationId: creationId || '' },
  })

  useEffect(() => {
    if (creationId) {
      getStars()
    }
  }, [creationId])
  return (
    <div className="w-full h-fit">
      <h3 className="mt-4 mb-2 space-x-2">
        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
        <span>{data?.stars.length || 'No'} Stars</span>
      </h3>

      <div className="flex flex-wrap">
        {data?.stars.map((item) => (
          <Link href={`${HOSTNAME}/${item.user.username}`}>
            <a className="relative group m-0.5">
              <img src={item.user.avatar} className="rounded bg-white w-8 h-8 cursor-pointer" />
              <div className="opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition translate-y-2 absolute top-5 -left-16 -right-16 text-center">
                <div className="px-2 inline-block text-sm space-x-1 font-medium  bg-white rounded text-black">
                  <span className="">{item.user.title}</span>
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
