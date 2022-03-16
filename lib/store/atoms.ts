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
    avatar: 'https://picsum.photos/200',
  },
})

