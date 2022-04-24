/**
 * Model User
 *
 */
export type User = {
  id: string
  created_at: Date
  updated_at: Date
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  hashed_rt: string | null
}

/**
 * Model UserImage
 *
 */
export type Profile = {
  id: string
  created_at: Date
  updated_at: Date
  user_id: string
  bio?: string
  org?: string
  location?: string
  website?: string
  avatar: string
  banner?: string
}

/**
 * Model Readme
 *
 */
export type Readme = {
  id: string
  created_at: Date
  updated_at: Date
  user_id: string
  content: string
}

/**
 * Model Follow
 *
 */
export type Follow = {
  id: string
  created_at: Date
  updated_at: Date
  follower_id: string
  followee_id: string
}

/**
 * Model Creation
 *
 */
export type Creation = {
  id: string
  created_at: Date
  updated_at: Date
  owner_id: string
  title: string
  code_html: string
  code_css: string
  code_js: string
}

/**
 * Model Comment
 *
 */
export type Comment = {
  id: string
  created_at: Date
  updated_at: Date
  owner_id: string
  creation_id: string
  title: string
  content: string
}

/**
 * Model Star
 *
 */
export type Star = {
  id: string
  created_at: Date
  updated_at: Date
  owner_id: string
  creation_id: string
}

/**
 * Model Pin
 *
 */
export type Pin = {
  id: string
  created_at: Date
  updated_at: Date
  owner_id: string
  creation_id: string
}

export type TWhoAmI = Omit<
  User & {
    profile: Profile
  },
  'password' | 'hashed_rt' | 'created_at' | 'updated_at'
>

export enum EAccountType {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
}

export type TExistedCheckVo = {
  isExisted: boolean
}

export type TExistedCheckDto = {
  type: EAccountType
  value: string
}

export type TSignInDto = {
  account: string
  password: string
  type: EAccountType
}

export type TSignUpDto = {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}

export type TUpdateUserReadmeDto = {
  content: string
}

export enum EUserImageType {
  AVATAR = 'AVATAR',
  BANNER = 'BANNER',
}

export type TUploadUserImageDto = {
  file: any
  type: EUserImageType
}

export type TToggleStarDto = {
  // creation id
  creation_id: string
  // star id
  star_id: string
}

export type TTogglePinDto = {
  // creation id
  creation_id: string
  // star id
  pin_id: string
}

export type TToggleFollowDto = {
  // follow the user id
  target_id: string
  // follow model id
  follow_id: string
}

export enum EGetFollowsType {
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWEES = 'FOLLOWEES',
}

export enum EGetCreationsType {
  STARS = 'STARS',
  PINS = 'PINS',
  CREATIONS = 'CREATIONS',
}
