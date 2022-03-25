import { useRecoilState } from 'recoil'

import { codeState } from '@lib/store/atoms'
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
  const [code, setCode] = useRecoilState(codeState)

  const handleOnMount: OnMount = (editor, monaco) => {
    switch (lang) {
      case 'html':
        code.html && editor.setValue(code.html)
        break
      case 'css':
        code.css && editor.setValue(code.css)
        break
      case 'javascript':
        code.javascript && editor.setValue(code.javascript)
        break
    }
  }

  const handleOnChange: OnChange = (value, event) => {
    switch (lang) {
      case 'html':
        setCode({ html: value, css: code.css, javascript: code.javascript })
        break
      case 'css':
        setCode({ html: code.html, css: value, javascript: code.javascript })
        break
      case 'javascript':
        setCode({ html: code.html, css: code.css, javascript: value })
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
