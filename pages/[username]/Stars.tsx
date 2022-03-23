import { CreationItem, Function } from '@components/platform'

export const Stars: React.VFC<any> = () => {
  return (
    <div className="flex flex-col">
      <Function />
      <div className="grid grid-cols-3 p-4">
        <CreationItem />
      </div>
    </div>
  )
}
