import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '@lib/store/atoms'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Comment } from '@lib/api/schema'

type CommentsVariables = {
  creationId: string
}

type CommentsOutput = {
  comments: Comment[]
}

const COMMENTS_QUERY = gql`
  query Comments($creationId: String!) {
    comments(creationId: $creationId) {
      _id
      updatedAt
      content
      commenter {
        title
        username
        avatar
      }
      creationId
    }
  }
`

type CommentVariables = {
  input: {
    creationId: string
    commenter: string
    content: string
  }
}

type CommentOutput = {
  comment: Comment
}

const COMMENT_MUTATION = gql`
  mutation CommentMutation($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      _id
      creationId
      content
      commenter {
        title
        avatar
        username
      }
      createdAt
      updatedAt
    }
  }
`

interface CommentProps {
  creationId?: string
}

export const CommentPanel: React.VFC<CommentProps> = ({ creationId }) => {
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const { username } = useRecoilValue(userProfileState)

  const [comments, setComments] = useState<Comment[]>([])

  const [getComments] = useLazyQuery<CommentsOutput, CommentsVariables>(COMMENTS_QUERY, {
    variables: {
      creationId: creationId || '',
    },
    onCompleted: (data) => {
      if (data) {
        setComments(data.comments)
      }
    },
  })

  const [comment] = useMutation<CommentOutput, CommentVariables>(COMMENT_MUTATION, {
    onCompleted: (data) => {
      if (data) {
        getComments()
      }
    },
  })

  const handleReplay = ({ commenter }: { commenter: string }) => {
    if (commentRef.current) {
      commentRef.current.value = '@' + commenter + ' '
      commentRef.current.focus()
    }
  }

  const handleComment = () => {
    if (commentRef.current) {
      comment({
        variables: {
          input: {
            creationId: creationId || '',
            commenter: username,
            content: commentRef.current.value,
          },
        },
      })
    }
  }

  useEffect(() => {
    getComments()
  }, [creationId])

  useEffect(() => {
    console.log(comments)
  }, [comments])

  return (
    <div className="space-y-4">
      <div className="relative p-3 bg-white rounded-lg overflow-hidden">
        <textarea
          placeholder="Write your comment here..."
          rows={5}
          ref={commentRef}
          className="p-0 w-full rounded-md outline-none border-none focus:ring-0 resize-none"
        />
        <button
          onClick={handleComment}
          className="float-right self-end px-4 py-1 rounded-md bg-gray-200 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100"
        >
          Comment
        </button>
      </div>
      <div className="relative p-4 bg-white rounded-md">
        <p className="text-gray-400 pb-4">
          <strong>{comments?.length || 'No'} Comments</strong>
          {!comments?.length && (
            <>
              <br />
              You can be the first!
            </>
          )}
        </p>
        {comments?.map((item, index) => (
          <div key={index} className="relative flex flex-col">
            {/* Commenter */}
            <div className="relative flex space-x-2 z-30">
              <img
                src={item.commenter.avatar}
                width={40}
                height={40}
                className="w-10 h-10 bg-white rounded-md border-4 border-white"
                alt=""
              />
              <p className="cursor-pointer flex-1">
                <span className="font-bold">{item.commenter.title}</span>
                <span className="text-sm font-semibold text-gray-400">(@{item.commenter.username})</span>
                <dd className="block text-xs font-medium text-gray-400">
                  {new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </dd>
              </p>
              <button
                onClick={() => handleReplay({ commenter: item.commenter.username })}
                className="bg-gray-300 h-fit font-medium text-gray-600 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100 px-2 rounded"
              >
                Replay
              </button>
            </div>
            {/* Content */}
            <div className="relative ml-4 px-3 pt-2 pb-8 border-l-2">
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
