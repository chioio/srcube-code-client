import { createContext, useContext, useReducer } from 'react'
import { Creation, Profile, User } from 'typings'

export enum EViewDirection {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

type TCreation = Pick<
  Creation,
  'owner_id' | 'title' | 'code_html' | 'code_css' | 'code_js'
> & {
  owner?: User & {
    profile?: Profile
  }
}

type TCodingAction =
  | {
      type: 'NEW_CREATION'
      payload?: {
        creation: TCreation
      }
    }
  | {
      type: 'SET_DIRECTION'
      payload: {
        direction: EViewDirection
      }
    }
  | {
      type: 'SET_CREATION'
      payload: {
        creation: TCreation
      }
    }

export interface ICodingContext {
  creation: TCreation
  direction: EViewDirection
  dispatch: React.Dispatch<TCodingAction>
}

export interface ICodingProvider {
  children: React.ReactNode
  creation?: TCreation
}

export type TCoding = {
  creation: TCreation
  direction: EViewDirection
}

const CodingContext = createContext<ICodingContext>(null!)

const useCoding = () => useContext(CodingContext)

const CodingReducer = (state: TCoding, { type, payload }: TCodingAction) => {
  switch (type) {
    case 'NEW_CREATION':
      return {
        ...state,
        creation: {
          title: 'Untitled',
          owner_id: '',
          code_html: '',
          code_css: '',
          code_js: '',
        },
      }
    case 'SET_DIRECTION':
      return {
        ...state,
        direction: payload.direction,
      }
    case 'SET_CREATION':
      return {
        ...state,
        creation: payload.creation,
      }
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

const initState = {
  creation: {
    title: 'Untitled',
    owner_id: '',
    code_html: '',
    code_css: '',
    code_js: '',
  },
  direction: EViewDirection.LEFT,
}

const CodingProvider: React.FC<ICodingProvider> = ({ children, creation }) => {
  const [state, dispatch] = useReducer<typeof CodingReducer>(CodingReducer, {
    ...initState,
    creation: creation || initState.creation,
  })

  return (
    <CodingContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CodingContext.Provider>
  )
}

const CodingConsumer = CodingContext.Consumer

export { CodingProvider as default, CodingConsumer, useCoding }
