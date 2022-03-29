import { gql } from '@apollo/client'

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      profile {
        username
        nickname
        firstName
        lastName
        avatar
        roles
      }
    }
  }
`

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      user
    }
  }
`
