import Link from 'next/link'

interface LogoProps {}

export const LogoIcon: React.VFC<LogoProps> = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8 md:w-10 md:h-10">
    <path
      className="fill-dark dark:fill-white"
      d="M46.9,115.5l192-110.8c10.6-6.2,23.7-6.2,34.3,0l192,110.8c10.6,6.2,17.1,17.5,17.1,29.7v221.7c0,12.2-6.5,23.5-17.1,29.7
l-192,110.8c-10.6,6.2-23.7,6.2-34.3,0l-192-110.8c-10.6-6.2-17.1-17.5-17.1-29.7V145.2C29.8,132.9,36.4,121.6,46.9,115.5z
M275.4,281.1v164.1c0,16,17.3,26,31.1,18l142-82.1c6.4-3.7,10.4-10.6,10.4-18l0.1-164c0-16-17.3-26-31.1-18l-142.1,82
C279.3,266.8,275.4,273.6,275.4,281.1z"
    />
    <line
      strokeWidth={28}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-blue-600"
      x1="307.7"
      y1="305.3"
      x2="430.1"
      y2="234.6"
    />
    <line
      strokeWidth={18}
      strokeMiterlimit={10}
      strokeLinecap="round"
      className="stroke-black dark:stroke-white"
      x1="307.7"
      y1="367.3"
      x2="391.7"
      y2="318.7"
    />
    <line
      strokeWidth={18}
      strokeMiterlimit={10}
      strokeLinecap="round"
      className="stroke-black dark:stroke-white"
      x1="307.7"
      y1="415.9"
      x2="391.7"
      y2="367.3"
    />
  </svg>
)

export const Logo: React.VFC<LogoProps> = () => {
  return (
    <Link href="/" passHref>
      <div className="flex-grow-0 flex items-center h-full cursor-pointer">
        <LogoIcon />
        <h1 className="ml-2 text-xl md:text-2xl text-black font-medium select-none dark:text-white">
          SRCUBE
          <span className="text-base md:text-xl font-extralight">
            &nbsp;|&nbsp;
            <code className="px-1 py-0.5 bg-slate-100 rounded-md text-xs lg:text-sm text-blue-600 font-bold dark:bg-gray-800">
              &#x276E;code/&#x276F;
            </code>
          </span>
        </h1>
      </div>
    </Link>
  )
}
