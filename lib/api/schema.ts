/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum UserRole {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AccountType {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
}

export interface ExistedCheckInput {
  type: AccountType
  value: string
}

export interface CreateUserInput {
  username: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateUserInput {
  username?: Nullable<string>
  password?: Nullable<string>
  firstName?: Nullable<string>
  lastName?: Nullable<string>
  id: number
}

export interface SignInInput {
  account: string
  password: string
  type: string
}

export interface SignUpInput {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

export interface CreateWorkInput {
  name?: Nullable<string>
  username: string
  codeHTML: string
  codeCSS: string
  codeJS: string
}

export interface UpdateWorkInput {
  name?: Nullable<string>
  username?: Nullable<string>
  codeHTML?: Nullable<string>
  codeCSS?: Nullable<string>
  codeJS?: Nullable<string>
  id: number
}

export interface User {
  email: string
  username: string
  password: string
  nickname?: Nullable<string>
  firstName: string
  lastName: string
  roles: UserRole[]
  createdAt: DateTime
  updatedAt: DateTime
}

export interface ExistedCheckOutput {
  result: boolean
}

export interface UserProfileOutput {
  username: string
  nickname?: Nullable<string>
  firstName?: Nullable<string>
  lastName?: Nullable<string>
  avatar: string
  roles: UserRole[]
}

export interface SignInOutput {
  token: string
  profile: UserProfileOutput
}

export interface SignOutOutput {
  msg: string
}

export interface SignUpOutput {
  user: string
}

export interface Work {
  name: string
  user: string
  codeHTML: string
  codeCSS: string
  codeJS: string
  createdAt: DateTime
  updatedAt: DateTime
}

export interface IQuery {
  users(): User[] | Promise<User[]>
  user(username: string): User | Promise<User>
  whoAmI(): User | Promise<User>
  existedCheck(input: ExistedCheckInput): ExistedCheckOutput | Promise<ExistedCheckOutput>
  work(id: number): Work | Promise<Work>
}

export interface IMutation {
  createUser(createUserInput: CreateUserInput): User | Promise<User>
  updateUser(updateUserInput: UpdateUserInput): User | Promise<User>
  signIn(input: SignInInput): SignInOutput | Promise<SignInOutput>
  signOut(): SignOutOutput | Promise<SignOutOutput>
  signUp(input: SignUpInput): SignUpOutput | Promise<SignUpOutput>
  createWork(createWorkInput: CreateWorkInput): Work | Promise<Work>
  updateWork(updateWorkInput: UpdateWorkInput): Work | Promise<Work>
  removeWork(id: number): Work | Promise<Work>
}

export type DateTime = any
type Nullable<T> = T | null
