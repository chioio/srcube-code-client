import { createContext, useContext, useEffect, useReducer } from 'react'
import { User, Profile, Follow, Readme } from 'typings'

export type TUserProfile = Omit<
  User & {
    profile: Omit<Profile, 'updated_at' | 'created_at'>
    readme: Omit<Readme, 'updated_at' | 'created_at'>
    followers: Follow[]
    followees: Follow[]
  } & {
    _count: {
      followers: number
      followees: number
    }
  },
  'password' | 'hashed_rt' | 'created_at' | 'updated_at'
>

export type TProfileActions =
  | {
      type: 'FOLLOW'
      payload: {
        follow: Follow
      }
    }
  | {
      type: 'UNFOLLOW'
      payload: {}
    }
  | {
      type: 'FOLLOWERS_READY'
      payload: {
        followers: (Follow & {
          follower: User & { profile: Profile; followers: Follow[] }
        })[]
      }
    }
  | {
      type: 'FOLLOWEES_READY'
      payload: {
        followees: (Follow & { followee: User & { profile: Profile } })[]
      }
    }
  | {
      type: 'DATA_READY'
      payload: {
        user: TUserProfile
      }
    }

export interface IProfileContext {
  user: TUserProfile
  dispatch: React.Dispatch<TProfileActions>
}

export interface IProfileProvider {
  children: React.ReactNode
  context: {
    user: TUserProfile
  }
}

const ProfileContext = createContext<IProfileContext>(null!)

const ProfileReducer = (
  state: TUserProfile,
  { type, payload }: TProfileActions
) => {
  switch (type) {
    case 'FOLLOW':
      return {
        ...state,
        _count: {
          ...state._count,
          followees: state._count.followees + 1,
        },
      }
    case 'UNFOLLOW':
      return {
        ...state,
        _count: {
          ...state._count,
          followees: state._count.followees - 1,
        },
      }
    case 'FOLLOWERS_READY':
      return {
        ...state,
        followers: payload.followers,
      }
    case 'FOLLOWEES_READY':
      return {
        ...state,
        followees: payload.followees,
      }
    case 'DATA_READY':
      return {
        ...state,
        ...payload.user,
      }

    default:
      throw new Error('Unknown action type')
  }
}

// get user from ssr, so not need to init.
/*
const initProfileState: TProfile = {
  id: '',
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  profile: {
    id: '',
    bio: '',
    org: '',
    user_id: '',
    avatar: '',
    location: '',
    website: '',
  },
  followers: [],
  followees: [],
  _count: {
    followers: 0,
    followees: 0,
  },
}
*/

const ProfileProvider: React.FC<IProfileProvider> = ({ children, context }) => {
  const [user, dispatch] = useReducer<typeof ProfileReducer>(
    ProfileReducer,
    context.user
  )

  useEffect(() => {
    dispatch({
      type: 'DATA_READY',
      payload: {
        user: context.user,
      },
    })
  }, [context.user])

  return (
    <ProfileContext.Provider value={{ user, dispatch }}>
      {children}
    </ProfileContext.Provider>
  )
}

const useProfile = () => useContext(ProfileContext)

export { ProfileProvider as default, useProfile }
