import { atom } from 'recoil'
import { Content } from './Content'
import { Preview } from './Preview'

interface CreationItemProps {}

export const CreationItem: React.VFC<CreationItemProps> = () => {
  return (
    <article
      className="group relative p-3.5 -z-0 w-full h-fit 
      hover:after:inset-0 hover:after:rounded-2xl 
      after:absolute after:top-7 after:left-3.5 after:right-0 after:bottom-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300"
    >
      <Preview />
      <Content />
    </article>
  )
}
