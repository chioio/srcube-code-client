import { Creation } from '@lib/api/schema'
import { useState } from 'react'
import MonacoEditor, { loader, EditorProps as MonacoEditorProps, OnMount, OnChange } from '@monaco-editor/react'

loader.config({
  paths: {
    vs: '/monaco-editor/min/vs',
  },
})

interface PreviewPanelProps {
  creation?: Creation
}

enum Tab {
  HTML,
  CSS,
  JS,
  RESULT,
}

export const PreviewPanel: React.VFC<PreviewPanelProps> = ({ creation }) => {
  const [tab, setTab] = useState(Tab.RESULT)

  const [random, setRandom] = useState(0)

  const styles = {
    tab: {
      active: 'bg-gray-500 text-white',
    },
    action: {
      lang: 'px-3 py-0.5 rounded-t-sm font-medium border-b-4 border-gray-400 bg-gray-300',
      preview: 'px-3 py-0.5 rounded-b-sm text-xs font-medium border-t-4 border-gray-400 bg-gray-300',
    },
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <div className="space-x-0.5">
          <button
            onClick={() => setTab(Tab.HTML)}
            className={`${styles.action.lang} ${tab === Tab.HTML ? styles.tab.active : ''}`}
          >
            HTML
          </button>
          <button
            onClick={() => setTab(Tab.CSS)}
            className={`${styles.action.lang} ${tab === Tab.CSS ? styles.tab.active : ''}`}
          >
            CSS
          </button>
          <button
            onClick={() => setTab(Tab.JS)}
            className={`${styles.action.lang} ${tab === Tab.JS ? styles.tab.active : ''}`}
          >
            JAVASCRIPT
          </button>
        </div>
        <button
          onClick={() => setTab(Tab.RESULT)}
          className={`${styles.action.lang} ${tab === Tab.RESULT ? styles.tab.active : ''}`}
        >
          Result
        </button>
      </div>

      {/* Panel */}
      <div className="relative w-full h-72 bg-white">
        {creation ? (
          <>
            {tab === Tab.RESULT ? (
              <Frame key={random} creation={creation} />
            ) : (
              <div className="flex h-full overflow-hidden">
                <div className="w-7/12 h-full text-white">
                  {tab === Tab.HTML && <Editor code={creation.code.html} lang={'html'} />}
                  {tab === Tab.CSS && <Editor code={creation.code.css} lang={'css'} />}
                  {tab === Tab.JS && <Editor code={creation.code.javascript} lang={'javascript'} />}
                </div>
                <div className="relative w-5/12 h-full">
                  <Frame key={random} creation={creation} />
                </div>
              </div>
            )}
          </>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
      <div className="flex justify-end">
        {/* <div className="space-x-0.5">
          <button className={`${styles.action.preview}`}>1.0</button>
          <button className={`${styles.action.preview}`}>0.5</button>
          <button className={`${styles.action.preview}`}>0.25</button>
        </div> */}
        <button onClick={() => setRandom((value) => (value += 1))} className={`${styles.action.preview}`}>
          Refresh
        </button>
      </div>
    </div>
  )
}

const Frame: React.VFC<{ creation: Creation }> = ({ creation }) => {
  return (
    <iframe
      title={creation.title}
      className="absolute top-0 bottom-0 left-0 right-0 w-[calc(200%+5px)] h-[calc(200%+5px)] min-h-[15rem] origin-top-left scale-50 bg-white border"
      srcDoc={`<html class="dark:bg-black dark:text-white">
                <title>${creation.title}</title>
                <style id="_style">${creation.code.css}</style>
                <script type="module" id="_script">
                ${creation.code.javascript}
                </script>
                <body>
                ${creation.code.html}
                </body>
              </html>
            `}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
    />
  )
}

const Editor: React.VFC<{ code: string; lang: string }> = ({ code, lang }) => {
  return <MonacoEditor defaultLanguage={lang} value={code} options={options} />
}

const options: MonacoEditorProps['options'] = {
  readOnly: true,
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
