
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum UserRole {
    ROOT = "ROOT",
    ADMIN = "ADMIN",
    USER = "USER",
    type = "type"
}

export enum AccountType {
    USERNAME = "USERNAME",
    EMAIL = "EMAIL"
}

export interface ExistedCheckInput {
    type: AccountType;
    value: string;
}

export interface CreateUserInput {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface UpdateUserInput {
    username?: Nullable<string>;
    password?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    avatar?: Nullable<string>;
    id: number;
}

export interface SignInInput {
    account: string;
    password: string;
    type: string;
}

export interface SignUpInput {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface CreateCreationInput {
    title?: Nullable<string>;
    author: string;
    code?: Nullable<CreateCodeInput>;
}

export interface CreateCodeInput {
    html?: Nullable<string>;
    css?: Nullable<string>;
    javascript?: Nullable<string>;
}

export interface UpdateCreationInput {
    _id?: string;
    title?: Nullable<string>;
    author?: string;
    code?: Nullable<UpdateCodeInput>;
}

export interface UpdateCodeInput {
    html?: Nullable<string>;
    css?: Nullable<string>;
    javascript?: Nullable<string>;
}

export interface User {
    _id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: string;
    roles: UserRole[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface ExistedCheckOutput {
    result: boolean;
}

export interface UserProfileOutput {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    roles: UserRole[];
}

export interface SignInOutput {
    token: string;
    profile: UserProfileOutput;
}

export interface SignOutOutput {
    msg: string;
}

export interface SignUpOutput {
    user: string;
}

export interface CreationCode {
    html: string;
    css: string;
    javascript: string;
}

export interface Creation {
    _id: string;
    title: string;
    author: string;
    code: CreationCode;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
    user(username: string): User | Promise<User>;
    whoAmI(): User | Promise<User>;
    existedCheck(input: ExistedCheckInput): ExistedCheckOutput | Promise<ExistedCheckOutput>;
    creations(): Creation[] | Promise<Creation[]>;
    creation(_id: string): Creation | Promise<Creation>;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    signIn(input: SignInInput): SignInOutput | Promise<SignInOutput>;
    signOut(): SignOutOutput | Promise<SignOutOutput>;
    signUp(input: SignUpInput): SignUpOutput | Promise<SignUpOutput>;
    createCreation(input: CreateCreationInput): Creation | Promise<Creation>;
    updateCreation(updateCreationInput: UpdateCreationInput): boolean | Promise<boolean>;
    removeCreation(id: number): Creation | Promise<Creation>;
}

export type DateTime = any;
type Nullable<T> = T | null;
