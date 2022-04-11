import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HOSTNAME } from "@lib/constants";
import toast from "react-hot-toast";

export const ShareLinks: React.VFC<{ author?: string; creationId?: string }> = ({ author, creationId }) => {
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${HOSTNAME}/${author}/creation/${creationId}`)
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
      <button onClick={handleCopyLink} className="px-2 py-1 rounded space-x-1 text-sm text-semibold bg-gray-200">
        <FontAwesomeIcon icon={faLink} />
        <span>CopyLink</span>
      </button>
    </div>
  )
}
