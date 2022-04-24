import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { useState } from 'react'

const HOSTNAME = 'http://localhost:3000'

export const CreationShareLink: React.FC<any> = ({ creationId, owner }) => {
  
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${HOSTNAME}/${owner}/creation/${creationId}`)
      .then(() => {
        toast.success('Copy to clipboard success!')
      })
      .catch((err) => {
        toast.success(err)
      })
  }

  return (
    <div className="py-2 px-3 space-x-3 bg-white rounded-md">
      <span className="font-semibold text-gray-400/60">SHARE</span>
      <button
        onClick={handleCopyLink}
        className="px-2 py-1 rounded space-x-1 text-sm text-semibold bg-gray-200"
      >
        <FontAwesomeIcon icon={faLink} />
        <span>CopyLink</span>
      </button>
    </div>
  )
}
