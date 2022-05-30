import httpCsr from '@lib/utils/http-csr'
import { useRouter } from 'next/router'
import { TUrlQuery } from 'pages/[username]'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { Creation, EGetCreationsType, Pin, Profile, Star, User } from 'typings'

export type TCreation = Creation & {
  owner: User & {
    profile: Profile
  }
  stars: Star[]
  pins: Pin[]
} & {
  _count: {
    stars: number
    comments: number
  }
}

type TCreationsActions =
  | {
      type: 'REMOVE_STAR'
      payload: {
        star_id: string
      }
    }
  | {
      type: 'REMOVE_PIN'
      payload: {
        pin_id: string
      }
    }
  | {
      type: 'TOGGLE_STAR'
      payload: {
        star: any
        creation_id: string
      }
    }
  | {
      type: 'TOGGLE_PIN'
      payload: {
        pin: any
        creation_id: string
      }
    }
  | {
      type: 'DELETE_CREATION'
      payload: string
    }
  | {
      type: 'DATA_READY'
      payload: {
        data: TPage
      }
    }
// | {
//     type: 'PAGE_CHANGE'
//     payload: {
//       page_num: number
//     }
//   }

export interface ICreationsContext {
  page: {
    creations: TCreation[]
    hasPrevPage: boolean
    hasNextPage: boolean
    // pageNum: number
  }
  dispatch: React.Dispatch<TCreationsActions>
}

export interface ICreationsProvider {
  children: React.ReactNode
  type: EGetCreationsType
}

export type TPage = ICreationsContext['page']

const CreationsContext = createContext<ICreationsContext>(null!)

const CreationsReducer = (
  state: TPage,
  { type, payload }: TCreationsActions
) => {
  switch (type) {
    // in stars list, remove star
    case 'REMOVE_STAR':
      return {
        ...state,
        creations: state.creations.filter(
          (item) => item.stars[0].id !== payload.star_id
        ),
      }
    // in pins list, remove pin
    case 'REMOVE_PIN':
      return {
        ...state,
        creations: state.creations.filter(
          (item) => item.pins[0].id !== payload.pin_id
        ),
      }
    // in creations list, toggle star
    case 'TOGGLE_STAR':
      return {
        ...state,
        creations: state.creations.map((item) => {
          if (item.id === payload.creation_id) {
            return {
              ...item,
              _count: {
                ...item._count,
                stars: payload.star.id
                  ? item._count.stars + 1
                  : item._count.stars - 1,
              },
              stars: payload.star.id ? [payload.star] : [],
            }
          }
          return item
        }),
      }
    // in creations list, toggle pin
    case 'TOGGLE_PIN':
      return {
        ...state,
        creations: state.creations.map((item) => {
          if (item.id === payload.creation_id) {
            return {
              ...item,
              pins: payload.pin.id ? [payload.pin] : [],
            }
          }
          return item
        }),
      }
    case 'DELETE_CREATION':
      return {
        ...state,
        creations: state.creations.filter((item) => item.id !== payload),
      }
    // data ready from async data fetch
    case 'DATA_READY':
      return payload.data
    // page change
    // case 'PAGE_CHANGE':
    //   return {
    //     ...state,
    //     pageNum: payload.page_num,
    //   }
    default:
      throw Error('Unknown action type')
  }
}

const initPageState: TPage = {
  creations: [],
  hasPrevPage: false,
  hasNextPage: false,
  // pageNum: 1,
}

const CreationsProvider: React.FC<ICreationsProvider> = ({
  children,
  type,
}) => {
  const router = useRouter()
  const { username, page_num } = router.query as TUrlQuery

  const [page, dispatch] = useReducer<typeof CreationsReducer>(
    CreationsReducer,
    initPageState
  )

  useEffect(() => {
    const fetchCreations = async () => {
      const { data, status } = await httpCsr.get('/user/creations', {
        params: { user: username, type, page: page_num || 1 },
      })

      if (status === 200) {
        console.log(data)
        dispatch({
          type: 'DATA_READY',
          payload: {
            data,
          },
        })
      }
    }

    username && fetchCreations()
  }, [username, type, page_num])

  return (
    <CreationsContext.Provider value={{ page, dispatch }}>
      {children}
    </CreationsContext.Provider>
  )
}

const useCreations = () => useContext(CreationsContext)

export { CreationsProvider as default, useCreations }
