import { Copyright } from './Copyright'

interface FooterProps {}

export const Footer: React.VFC<FooterProps> = () => {
  return (
    <footer className="flex items-end px-4 py-4 md:py-5 bg-gray-100/70 border-t border-gray-200/50">
      <Copyright />
    </footer>
  )
}
