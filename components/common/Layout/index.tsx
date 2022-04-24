import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => (
  <div className="fixed h-screen w-screen flex flex-col bg-white transition duration-400 ease-in-out">
    {children}
  </div>
)
