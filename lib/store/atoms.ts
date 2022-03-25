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

export interface CodeState {
  html: string | undefined
  css: string | undefined
  javascript: string | undefined
}

export const codeState = atom<CodeState>({
  key: 'codeState',
  default: {
    html: '<h1>Hello World</h1>',
    css: '',
    javascript: '',
  },
})

export interface WorkState {
  title: string
  author: string | undefined
  code: CodeState
}

export const workState = atom<WorkState>({
  key: 'workState',
  default: {
    title: 'Untitled',
    author: 'author',
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
  default: 'left',
})
