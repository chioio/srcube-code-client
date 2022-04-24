import { createContext, useContext, useReducer } from 'react'

export enum ECodeEditorTheme {
  VS_DARK = 'vs-dark',
  GH_LIGHT = 'github-light',
  GH_DARK = 'github-dark',
  GH_LIGHT_COLORBLIND = 'github-light-colorblind',
  GH_DARK_COLORBLIND = 'github-dark-colorblind',
}

type TCodeEditorActions = {
  type: 'SET_THEME'
  payload: {
    theme: ECodeEditorTheme
  }
}

export interface ICodeEditorContext {
  theme: ECodeEditorTheme
  dispatch: React.Dispatch<TCodeEditorActions>
}

export interface ICodeEditorProvider {
  children: React.ReactNode
}

export type TEditor = {
  theme: ECodeEditorTheme
}

const CodeEditorContext = createContext<ICodeEditorContext>(null!)

const useCodeEditor = () => useContext(CodeEditorContext)

const EditorReducer = (
  state: TEditor,
  { type, payload }: TCodeEditorActions
) => {
  switch (type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: payload.theme,
      }
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

const CodeEditorProvider: React.FC<ICodeEditorProvider> = ({ children }) => {
  const [state, dispatch] = useReducer<typeof EditorReducer>(EditorReducer, {
    theme: ECodeEditorTheme.GH_LIGHT,
  })

  return (
    <CodeEditorContext.Provider
      value={{
        theme: state.theme,
        dispatch,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  )
}

export { CodeEditorProvider as default, useCodeEditor }
