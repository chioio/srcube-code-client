export const Main: React.VFC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="flex-grow overflow-y-auto bg-gray-100/70 bg-[url('/img/bg-layout-light.svg')] bg-center bg-[length:15rem] dark:bg-gray-900/90 dark:bg-[url('/img/bg-layout-dark.svg')]">
    {children}
  </main>
)
