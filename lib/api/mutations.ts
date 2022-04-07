import { gql } from '@apollo/client'

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      profile {
        username
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

export const CREATE_CREATION_MUTATION = gql`
  mutation CreateCreation($input: CreateCreationInput!) {
    createCreation(input: $input) {
      _id
      title
      author
      code {
        html
        css
        javascript
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_CREATION_MUTATION = gql`
  mutation UpdateCreation($input: UpdateCreationInput!) {
    updateCreation(input: $input)
  }
`
