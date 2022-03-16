import { forwardRef, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  name: string
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [statusStyle, setStatusStyle] = useState<string>()

  const ctx = useFormContext()

  useEffect(() => {
    ctx.formState.errors[props.name]
      ? setStatusStyle('ring ring-red-500 border-red-600')
      : ctx.getValues(props.name) && setStatusStyle('ring ring-green-300 border-green-400')
  }, [ctx.getValues(props.name), ctx.formState.errors[props.name]])

  return (
    <input
      className={`w-full mb-2 rounded-lg focus:ring-2 focus:ring-blue-600 selection:autofill:bg-gray-700/50 dark:text-white dark:border-gray-900/60 dark:bg-gray-700/50 ${statusStyle}`}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
