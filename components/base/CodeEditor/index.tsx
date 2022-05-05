import { Component, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import MonacoEditor, {
  loader,
  useMonaco,
  EditorProps as MonacoEditorProps,
} from '@monaco-editor/react'
import * as Monaco from 'monaco-editor'

import { wireTmGrammars } from 'monaco-editor-textmate'
import { registry } from '@lib/monaco/language'
import cssFormatMonaco from 'css-format-monaco'

import VS_DARK from '@lib/monaco/themes/vs-dark.json'
import GH_LIGHT from '@lib/monaco/themes/github/light-high-contrast.json'
import GH_DARK from '@lib/monaco/themes/github/dark.json'
import GH_LIGHT_COLORBLIND from '@lib/monaco/themes/github/light-colorblind.json'

import { ECodeEditorTheme, useCodeEditor } from '@lib/context/CodeEditorContext'
import { loadWASM } from 'onigasm'

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})

async function load() {
  return await loadWASM('/wasm/onigasm.wasm')
}

load()

export enum ECodeEditorLanguage {
  CSS = 'css',
  HTML = 'html',
  JS = 'javascript',
  TS = 'typescript',
}

interface ICodeEditor {
  lang: ECodeEditorLanguage
  value: string
  defaultValue?: string
  onChange: (value?: string) => void
  readOnly?: boolean
}

export const CodeEditor: React.FC<ICodeEditor> = ({
  lang,
  value,
  defaultValue,
  onChange,
  readOnly,
}) => {
  const { theme } = useCodeEditor()
  const monaco = useMonaco()

  const editorRef = useRef<Monaco.editor.ICodeEditor>()

  const handleMount = (
    editor: Monaco.editor.ICodeEditor,
    monaco: typeof Monaco
  ) => {
    monaco.editor.defineTheme(
      'vs-dark',
      VS_DARK as unknown as Monaco.editor.IStandaloneThemeData
    )

    monaco.editor.defineTheme(
      ECodeEditorTheme.GH_DARK_COLORBLIND,
      GH_LIGHT_COLORBLIND as unknown as Monaco.editor.IStandaloneThemeData
    )
    monaco.editor.defineTheme(
      ECodeEditorTheme.GH_LIGHT_COLORBLIND,
      GH_LIGHT_COLORBLIND as unknown as Monaco.editor.IStandaloneThemeData
    )
    monaco.editor.defineTheme(
      ECodeEditorTheme.GH_LIGHT,
      GH_LIGHT as unknown as Monaco.editor.IStandaloneThemeData
    )
    monaco.editor.defineTheme(
      ECodeEditorTheme.GH_DARK,
      GH_DARK as unknown as Monaco.editor.IStandaloneThemeData
    )

    const loadGrammars = async () => {
      // Load grammar
      const grammars = new Map()

      switch (lang) {
        case ECodeEditorLanguage.HTML:
          grammars.set('html', 'text.html.basic')
          monaco.languages.register({ id: 'html' })
          break
        case ECodeEditorLanguage.CSS:
          grammars.set('css', 'source.css')
          monaco.languages.register({ id: 'css' })
          break
        case ECodeEditorLanguage.JS:
          grammars.set('javascript', 'source.js')
          grammars.set('javascript', 'source.js.jsx')
          monaco.languages.register({ id: 'jsx' })
          monaco.languages.register({ id: 'javascript' })
          break
        case ECodeEditorLanguage.TS:
          grammars.set('typescript', 'source.ts')
          grammars.set('typescript', 'source.tsx')
          monaco.languages.register({ id: 'tsx' })
          monaco.languages.register({ id: 'typescript' })
          break
        default:
          throw new Error('Grammar register error!')
      }

      await wireTmGrammars(monaco, registry, grammars, editorRef.current)
    }

    loadGrammars()
    monaco.editor.setTheme(theme)

    // CSS Format
    cssFormatMonaco(monaco, { indent_size: 2 })

    editorRef.current = editor
    // editor.focus()
  }

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme)
    }
  }, [theme])

  return (
    <div className="h-full overflow-hidden">
      <MonacoEditor
        width="100%"
        height="100%"
        language={lang}
        theme={theme}
        value={value}
        defaultValue={defaultValue}
        options={editorConfig({ readOnly })}
        onChange={(value) => onChange(value)}
        onMount={handleMount}
      />
    </div>
  )
}

const editorConfig = ({
  readOnly = false,
}: {
  readOnly?: boolean
}): MonacoEditorProps['options'] => {
  return {
    readOnly,
    tabSize: 2,
    fontSize: 15,
    wordWrap: 'on',
    cursorStyle: 'line',
    glyphMargin: false,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      horizontal: 'hidden',
      verticalScrollbarSize: 6,
    },
    lineDecorationsWidth: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    accessibilitySupport: 'auto',
    automaticLayout: true,
    codeLens: true,
    colorDecorators: true,
    contextmenu: true,
    cursorBlinking: 'blink',
    cursorSmoothCaretAnimation: false,
    disableLayerHinting: false,
    disableMonospaceOptimizations: false,
    dragAndDrop: false,
    fixedOverflowWidgets: false,
    folding: true,
    foldingStrategy: 'auto',
    fontLigatures: false,
    formatOnPaste: false,
    formatOnType: false,
    links: true,
    mouseWheelZoom: false,
    multiCursorMergeOverlapping: true,
    multiCursorModifier: 'alt',
    overviewRulerLanes: 2,
    quickSuggestions: true,
    quickSuggestionsDelay: 100,
    renderControlCharacters: false,
    renderFinalNewline: true,
    renderLineHighlight: 'all',
    renderWhitespace: 'none',
    revealHorizontalRightPadding: 30,
    roundedSelection: true,
    rulers: [],
    scrollBeyondLastColumn: 5,
    scrollBeyondLastLine: true,
    selectOnLineNumbers: true,
    selectionClipboard: true,
    selectionHighlight: true,
    showFoldingControls: 'mouseover',
    smoothScrolling: false,
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    wordSeparators: '~!@#$%^&*()-=+[{]}|;:\'",.<>/?',
    wordWrapBreakAfterCharacters: '\t})]?|&,;',
    wordWrapBreakBeforeCharacters: '{([+',
    wordWrapColumn: 80,
    wrappingIndent: 'none',
  }
}
