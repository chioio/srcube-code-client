
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
    _id: string;
    title?: Nullable<string>;
    author: string;
    code?: Nullable<UpdateCodeInput>;
}

export interface UpdateCodeInput {
    html?: Nullable<string>;
    css?: Nullable<string>;
    javascript?: Nullable<string>;
}

export interface CreateStarInput {
    username: string;
    creationId: string;
}

export interface CreateCommentInput {
    creationId: string;
    commenter: string;
    content: string;
}

export interface UpdateCommentInput {
    creationId?: Nullable<string>;
    commenter?: Nullable<string>;
    content?: Nullable<string>;
    id: number;
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
    stars: number;
    comments: number;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Starer {
    title: string;
    username: string;
    avatar: string;
}

export interface Star {
    _id: string;
    user: Starer;
    creationId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PageData {
    count: number;
    limit: number;
    offset: number;
}

export interface CreationsOutput {
    page: CreationConnection;
    pageData?: Nullable<PageData>;
}

export interface CreationConnection {
    edges?: Nullable<CreationEdge[]>;
    pageInfo?: Nullable<CreationPageInfo>;
}

export interface CreationEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Creation>;
}

export interface CreationPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Commenter {
    title: string;
    username: string;
    avatar: string;
}

export interface Comment {
    _id: string;
    creationId: string;
    commenter: Commenter;
    content: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Follow {
    _id: string;
    username: string;
    following: string;
}

export interface FollowsOutput {
    page: FollowConnection;
    pageData?: Nullable<PageData>;
}

export interface FollowConnection {
    edges?: Nullable<FollowEdge[]>;
    pageInfo?: Nullable<FollowPageInfo>;
}

export interface FollowEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Follow>;
}

export interface FollowPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Pin {
    _id: string;
    username: string;
    creationIds: string[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Readme {
    _id: string;
    user: string;
    content: string;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
    user(username: string): User | Promise<User>;
    whoAmI(): User | Promise<User>;
    existedCheck(input: ExistedCheckInput): ExistedCheckOutput | Promise<ExistedCheckOutput>;
    creations(search?: Nullable<string>, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>): CreationsOutput | Promise<CreationsOutput>;
    creation(_id: string): Creation | Promise<Creation>;
    star(username: string, creationId: string): Nullable<Star> | Promise<Nullable<Star>>;
    stars(username?: Nullable<string>, creationId?: Nullable<string>): Star[] | Promise<Star[]>;
    comments(creationId: string): Comment[] | Promise<Comment[]>;
    comment(id: number): Comment | Promise<Comment>;
    follow(following: string, username: string): Nullable<Follow> | Promise<Nullable<Follow>>;
    follows(following?: Nullable<string>, username?: Nullable<string>, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>): FollowsOutput | Promise<FollowsOutput>;
    pin(username: string): Pin | Promise<Pin>;
    readme(username: string): Nullable<Readme> | Promise<Nullable<Readme>>;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    signIn(input: SignInInput): SignInOutput | Promise<SignInOutput>;
    signOut(): SignOutOutput | Promise<SignOutOutput>;
    signUp(input: SignUpInput): SignUpOutput | Promise<SignUpOutput>;
    createCreation(input: CreateCreationInput): Creation | Promise<Creation>;
    updateCreation(input: UpdateCreationInput): boolean | Promise<boolean>;
    removeCreation(_id: string): boolean | Promise<boolean>;
    createStar(createStarInput: CreateStarInput): Star | Promise<Star>;
    removeStar(_id: string): boolean | Promise<boolean>;
    createComment(createCommentInput: CreateCommentInput): Comment | Promise<Comment>;
    updateComment(updateCommentInput: UpdateCommentInput): Comment | Promise<Comment>;
    removeComment(id: string): Comment | Promise<Comment>;
    createFollow(following: string, username: string): Follow | Promise<Follow>;
    removeFollow(following: string, username: string): boolean | Promise<boolean>;
    updatePin(pined: boolean, creationId: string, username: string): boolean | Promise<boolean>;
    updateReadme(content: string, username: string): Readme | Promise<Readme>;
    removeReadme(username: string): Readme | Promise<Readme>;
}

export type DateTime = any;
type Nullable<T> = T | null;
