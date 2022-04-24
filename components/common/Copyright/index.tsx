import Link from 'next/link'

interface CopyrightProps {
  align?: 'start' | 'center' | 'end'
}

export const Copyright: React.FC<CopyrightProps> = ({ align = 'center' }) => {
  return (
    <div className="w-full text-medium select-none dark:text-white">
      © {new Date().getFullYear()}{' '}
      <Link href="https://chioio.tech" passHref>
        <span className="hover:underline hover:text-blue-600 cursor-pointer">
          Srcube | chioio
        </span>
      </Link>
      <span> | Project for Graduation Design.</span>
    </div>
  )
}
