import { Creation, UserProfileOutput, UserRole } from '@lib/api/schema'
import { atom } from 'recoil'

export const userProfileState = atom<UserProfileOutput>({
  key: 'userProfileState',
  default: {
    username: 'chioio',
    firstName: 'Tenn',
    lastName: 'Chio',
    roles: [UserRole.USER],
    avatar: 'https://picsum.photos/300',
  },
})

export const creationState = atom<Creation>({
  key: 'creationState',
  default: {
    _id: '',
    title: '',
    author: '',
    code: {
      html: '',
      css: '',
      javascript: '',
    },
    createdAt: '',
    updatedAt: '',
  },
})

export type ViewDirectionState = 'left' | 'top' | 'right'

export const viewDirectionState = atom<ViewDirectionState>({
  key: 'viewState',
  default: 'top',
})
