export interface MainProps {
  children: React.ReactNode
  decorated?: boolean
}
export const Main: React.VFC<MainProps> = ({ children, decorated }) => (
  <main
    className={`flex-grow overflow-y-auto bg-gray-100/70 dark:bg-gray-900/90 ${
      decorated &&
      'bg-[url("/img/bg-layout-light.svg")] bg-center bg-[length:15rem] dark:bg-[url("/img/bg-layout-dark.svg")]'
    }`}
  >
    {children}
  </main>
)
