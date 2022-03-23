import { CreationItem, Function } from '@components/platform'

export const Creations: React.VFC<any> = () => {
  return (
    <div className="flex flex-col">
      <Function />
      <div className="p-4 grid grid-cols-2 2xl:grid-cols-3 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <CreationItem key={index} isCommon={false} />
        ))}
      </div>
    </div>
  )
}
