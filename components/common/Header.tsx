import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMeteor, faSearch } from '@fortawesome/free-solid-svg-icons'

import { Logo, UserMenu } from '@components/common'
import { useWindowMounted } from '@lib/hooks'
import { useState } from 'react'

interface HeaderProps {}

export const Header: React.VFC<HeaderProps> = () => {
  const router = useRouter()

  const [searchText, setSearchText] = useState('')

  const isWindowMounted = useWindowMounted()

  const handleNavToCreate = () => {
    router.push('/create')
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim().length > 0) {
      router.push({
        pathname: '/search',
        query: {
          q: searchText,
        },
      })
      setSearchText('')
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 md:py-2.5 max-h-fit border-b border-gray-200/80 bg-white">
      <Logo />
      <label className="flex-grow mx-10 relative block h-full">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-3 text-gray-400 text-xl flex items-center pl-2">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          className="placeholder:italic placeholder:text-slate-400 text-lg rounded-lg block bg-gray-100 w-full h-full border-none py-2 pl-14 pr-3 focus:outline-none focus:border-blue-500 focus:ring-blue-500/50 focus:ring-4"
          placeholder="Search for anything..."
          type="text"
          name="search"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
        />
      </label>
      {isWindowMounted && localStorage.getItem('token') && (
        <div>
          {/* New Creation */}
          <button
            className="mr-4 px-2 md:px-4 max-h-fit align-middle border-4 rounded-lg border-blue-600 text-base md:text-lg font-medium text-blue-600 active:bg-blue-600/5 active:shadow-sm"
            onClick={handleNavToCreate}
          >
            <FontAwesomeIcon icon={faMeteor} /> <span className="ml-1">NEW</span>
          </button>
          {/* User Menu */}
          <UserMenu />
        </div>
      )}
      {/* SIGN IN / UP */}
      {isWindowMounted && !localStorage.getItem('token') && (
        <div>
          <button
            className="mr-2 px-2.5 py-1 md:px-4 md:py-2 font-medium rounded-md bg-gray-200 text-black active:bg-gray-300 active:text-gray-900
        dark:bg-gray-800 dark:text-gray-300"
            onClick={() => router.push('/sign-up')}
          >
            SIGN UP
          </button>
          <button
            className="ml-2 px-2.5 py-1 md:px-4 md:py-2 bg-blue-600 text-white font-medium rounded-md active:bg-blue-500 active:text-gray-100
        dark:bg-blue-600 dark:active:bg-blue-700 dark:active:text-gray-300"
            onClick={() => router.push('/sign-in')}
          >
            SIGN IN
          </button>
        </div>
      )}
    </header>
  )
}
