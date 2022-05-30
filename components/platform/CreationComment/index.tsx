import { useAuth } from '@lib/context/AuthContext'
import { BASE_URL } from '@lib/utils'
import httpCsr from '@lib/utils/http-csr'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export const CreationComment: React.FC<{ creation: any }> = ({ creation }) => {
  const commentRef = useRef<HTMLTextAreaElement>(null)

  const { whoAmI } = useAuth()

  const [comments, setComments] = useState<any[]>(creation.comments)
  const [isRefresh, setIsRefresh] = useState(false)

  const handleReplay = ({ user }: { user: string }) => {
    if (!commentRef.current) return

    commentRef.current.value = `@${user} `
    commentRef.current.focus()
  }

  const handleComment = async () => {
    if (!commentRef.current) return

    const content = commentRef.current.value

    if (!content) return

    const { data, status } = await httpCsr.post('/creation/comment', {
      creation_id: creation.id,
      content,
    })

    if (status === 201) {
      setIsRefresh(true)
      commentRef.current.value = ''
      toast.success('Comment added!')
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      const { data, status } = await httpCsr.get(
        `/creation/comments?creation_id=${creation.id}`
      )

      if (status === 200) {
        setComments(data)
      }
    }

    setIsRefresh(false)

    creation.id && fetchComments()
  }, [creation.id, isRefresh])

  return (
    <div className="space-y-4">
      <div className="relative p-3 bg-white rounded-lg overflow-hidden">
        <textarea
          disabled={!whoAmI}
          placeholder="Write your comment here..."
          rows={5}
          ref={commentRef}
          className="p-0 w-full rounded-md outline-none border-none focus:ring-0 resize-none"
        />
        <button
          disabled={!whoAmI && !commentRef.current?.value}
          onClick={handleComment}
          className="float-right self-end px-4 py-1 rounded-md bg-gray-200 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100"
        >
          {whoAmI ? 'Comment' : 'Login to comment'}
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
        {comments?.map((comment, index) => (
          <div key={index} className="relative flex flex-col">
            {/* Commenter */}
            <div className="relative flex space-x-2 z-30">
              <img
                src={`${BASE_URL}/${comment?.owner?.profile?.avatar}`}
                width={40}
                height={40}
                className="w-10 h-10 bg-white rounded-md border-4 border-white"
                alt=""
              />
              <p className="cursor-pointer flex-1">
                <span className="font-bold">
                  {comment?.owner?.first_name + ' ' + comment?.owner?.last_name}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  (@{comment?.owner?.username})
                </span>
                <dd className="block text-xs font-medium text-gray-400">
                  {new Date(comment?.created_at).toLocaleDateString('en-US', {
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
                onClick={() => handleReplay({ user: comment?.owner?.username })}
                className="bg-gray-300 h-fit font-medium text-gray-600 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100 px-2 rounded"
              >
                Replay
              </button>
            </div>
            {/* Content */}
            <div className="relative ml-4 px-3 pt-2 pb-8 border-l-2">
              <p>{comment?.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
