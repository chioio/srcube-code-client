import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'

import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

import { useAuth } from '@lib/context/AuthContext'
import { CreationItem } from '@components/platform'
import { TUrlQuery } from '../../../pages/[username]'
import { EGetCreationsType } from 'typings'
import CreationsProvider, { useCreations } from '@lib/context/CreationsContext'
import httpCsr from '@lib/utils/http-csr'
import { useProfile } from '@lib/context/ProfileContext'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

export const Overview: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const { user } = useProfile()

  const router = useRouter()
  const { username } = router.query as TUrlQuery

  const [isEdit, setIsEdit] = useState(false)
  const [mdText, setMdText] = useState<string | null>(user.readme.content)

  const handleUpdateReadme = async () => {
    const { data, status } = await httpCsr.put('/user/readme', {
      content: mdText,
    })

    if (status === 200) {
      setIsEdit(false)
      setMdText(data.content)
      toast.success('Save success!')
    }
  }

  useEffect(() => {
    user.readme.content && setMdText(user.readme.content)
  }, [user.readme.content])

  return (
    <div className="relative space-y-4">
      <div
        className={`relative overflow-hidden py-4 ${
          isEdit ? 'px-4' : 'px-8'
        } min-h-[200px] border-2 rounded-lg`}
      >
        {!isEdit && (
          <code className="mb-2 inline-block text-xs">{username}/README</code>
        )}
        {whoAmI?.username === username && !isEdit && (
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="group absolute right-2 w-8 h-8 rounded-full opacity-20 hover:opacity-100 active:bg-gray-200/50 transition"
          >
            <FontAwesomeIcon
              icon={faPencil}
              className="-rotate-[30deg] group-hover:rotate-0 transition"
            />
          </button>
        )}
        {isEdit ? (
          // @ts-ignore
          <MDEditor
            value={mdText}
            onChange={setMdText}
            hideToolbar
            visiableDragbar={false}
          />
        ) : (
          // @ts-ignore
          <MDPreview source={mdText} />
        )}
        {isEdit && (
          <button
            onClick={handleUpdateReadme}
            className="relative bottom-0 mt-2.5 float-right px-4 py-1 rounded-md text-white bg-blue-600 hover:bg-opacity-90 active:shadow active:bg-opacity-100"
          >
            Save
          </button>
        )}
      </div>
      <div className="">
        <h3 className="text-xl font-bold">Pinned</h3>
        <div className="flex flex-col mx-auto w-full max-w-screen-xl rounded-2xl">
          <div
            className={`grid row-start-1 col-start-1 grid-cols-2 gap-4 slide`}
          >
            <CreationsProvider type={EGetCreationsType.PINS}>
              <PinCreationList />
            </CreationsProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

const PinCreationList: React.FC<any> = () => {
  const {
    page: { creations },
  } = useCreations()

  return (
    <>
      {creations &&
        creations.map(
          (item, index) =>
            item && <CreationItem creation={{ ...item }} key={index} />
        )}
    </>
  )
}
