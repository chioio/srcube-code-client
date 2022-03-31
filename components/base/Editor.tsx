import { useRecoilState } from 'recoil'

import { creationState } from '@lib/store/atoms'
import MonacoEditor, { loader, EditorProps as MonacoEditorProps, OnMount, OnChange } from '@monaco-editor/react'

loader.config({
  paths: {
    vs: '/monaco-editor/min/vs',
  },
})

type EditorLanguage = 'html' | 'css' | 'javascript'

interface CodeEditorProps {
  lang: EditorLanguage
  hint?: string
}

export const Editor: React.VFC<CodeEditorProps> = ({ lang, hint }) => {
  const [creation, setCreation] = useRecoilState(creationState)

  const handleOnMount: OnMount = (editor, monaco) => {
    switch (lang) {
      case 'html':
        creation.code.html && editor.setValue(creation.code.html)
        break
      case 'css':
        creation.code.css && editor.setValue(creation.code.css)
        break
      case 'javascript':
        creation.code.javascript && editor.setValue(creation.code.javascript)
        break
    }
  }

  const handleOnChange: OnChange = (value, event) => {
    switch (lang) {
      case 'html':
        setCreation({ ...creation, code: { ...creation.code, html: value } })
        break
      case 'css':
        setCreation({ ...creation, code: { ...creation.code, css: value } })
        break
      case 'javascript':
        setCreation({ ...creation, code: { ...creation.code, javascript: value } })
        break
    }
  }

  return (
    <MonacoEditor
      defaultLanguage={lang}
      defaultValue={hint}
      onMount={handleOnMount}
      onChange={handleOnChange}
      options={options}
    />
  )
}

const options: MonacoEditorProps['options'] = {
  cursorStyle: 'line',
  fontSize: 15,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  minimap: {
    enabled: false,
  },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  scrollbar: {
    horizontalScrollbarSize: 6,
    verticalScrollbarSize: 6,
  },
  tabSize: 2,
}
