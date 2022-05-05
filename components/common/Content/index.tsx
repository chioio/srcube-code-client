import React from 'react'

interface MainProps {
  children: React.ReactNode
  decorated?: boolean
}

export const Content: React.FC<MainProps> = ({ children, decorated }) => (
  <main
    className={`flex-grow flex flex-col overflow-y-auto overflow-x-hidden bg-gray-100/70 dark:bg-gray-900/90 ${
      decorated &&
      'bg-[url("/img/bg-layout-light.svg")] bg-center bg-[length:15rem] dark:bg-[url("/img/bg-layout-dark.svg")]'
    }`}
  >
    {children}
  </main>
)
