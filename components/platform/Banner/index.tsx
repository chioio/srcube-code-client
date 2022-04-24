import { useEffect, useRef } from 'react'
import styles from './index.module.css'

type TBanner = {
  image?: string
}

export const Banner: React.FC<TBanner> = ({ image }) => {
  const lightsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lights = lightsRef.current?.childNodes as NodeListOf<HTMLDivElement>
    if (lights) {
      for (let i = 0; i < lights.length; i++) {
        let offset = i * 2000
        lights[i].animate(
          [
            {
              opacity: '0',
              transform: `translate(${-25 + Math.random() * 50}%,${
                -25 + Math.random() * 50
              }%)`,
            },
            {
              opacity: '1',
              transform: `translate(${-25 + Math.random() * 50}%,${
                -25 + Math.random() * 50
              }%)`,
            },
          ],
          {
            // timing options
            duration: 1000 + Math.random() * 2000,
            easing: 'ease-in-out',
            iterations: Infinity,
            direction: 'alternate',
            iterationStart: Math.random() * 2000,
          }
        )
      }
    }
  }, [lightsRef])

  return (
    <div
      ref={lightsRef}
      className="relative flex items-center justify-center w-full h-80 bg-gray-800 overflow-hidden"
    >
      <div
        className={`${styles.gradient} ${styles.red}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.orange}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.yellow}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.green}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.blue}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.indigo}`}
      ></div>
      <div
        className={`${styles.gradient} ${styles.violet}`}
      ></div>
    </div>
  )
}
