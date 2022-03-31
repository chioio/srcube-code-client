import { UserProfileOutput, UserRole } from '@lib/api/schema'
import { atom } from 'recoil'

export const userProfileState = atom<UserProfileOutput>({
  key: 'userProfileState',
  default: {
    username: 'chioio',
    nickname: 'Yonn 🤯',
    firstName: 'Tenn',
    lastName: 'Chio',
    roles: [UserRole.USER],
    avatar: 'https://picsum.photos/300',
  },
})
export interface CreationState {
  title: string
  author: string | undefined
  code: {
    html: string | undefined
    css: string | undefined
    javascript: string | undefined
  }
}

export const creationState = atom<CreationState>({
  key: 'creationState',
  default: {
    title: 'Untitled',
    author: 'chioio',
    code: {
      html: '<h1>Hello World</h1>',
      css: '',
      javascript: '',
    },
  },
})

export type ViewDirectionState = 'left' | 'top' | 'right'

export const viewDirectionState = atom<ViewDirectionState>({
  key: 'viewState',
  default: 'top',
})
