import { CreationList } from '@components/platform'
import CreationsProvider from '@lib/context/CreationsContext'
import { EGetCreationsType } from 'typings'

export const Creations: React.FC<any> = () => {
  return (
    <div className="space-y-4">
      <CreationsProvider type={EGetCreationsType.CREATIONS}>
        <CreationList />
      </CreationsProvider>
    </div>
  )
}
