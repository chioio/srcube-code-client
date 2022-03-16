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
        roles
      }
    }
  }
`

