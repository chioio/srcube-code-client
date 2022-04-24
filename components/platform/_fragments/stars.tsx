import { CreationList } from '@components/platform'
import CreationsProvider, { useCreations } from '@lib/context/CreationsContext'
import { EGetCreationsType } from 'typings'

export const Stars: React.FC<any> = () => {
  return (
    <div className="space-y-4">
      <CreationsProvider type={EGetCreationsType.STARS}>
        <CreationList />
      </CreationsProvider>
    </div>
  )
}
