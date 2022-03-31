import { ReactNode } from 'react'

interface MainPanelProps {
  children: ReactNode
}

export const MainPanel: React.VFC<MainPanelProps> = ({ children }) => {
  return <main className="flex-grow flex flex-col border-t border-slate-200">{children}</main>
}
