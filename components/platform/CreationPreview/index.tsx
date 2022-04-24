import CodeEditorProvider, {
  ECodeEditorTheme,
  useCodeEditor,
} from '@lib/context/CodeEditorContext'
import { useState } from 'react'
import { CodeEditor, ECodeEditorLanguage } from '../../base/CodeEditor'
import { CreationFrame } from '../CreationFrame'

enum ETab {
  HTML,
  CSS,
  JS,
  RESULT,
}

export const CreationPreview: React.VFC<any> = ({ creation }) => {
  const { theme, dispatch } = useCodeEditor()

  const [tab, setTab] = useState(ETab.RESULT)

  const [random, setRandom] = useState(0)

  const handleSwitchTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: {
        theme:
          theme === ECodeEditorTheme.GH_LIGHT
            ? ECodeEditorTheme.GH_DARK
            : ECodeEditorTheme.GH_LIGHT,
      },
    })
  }

  const styles = {
    tab: {
      active: 'bg-gray-500 text-white',
    },
    action: {
      lang: 'px-3 py-0.5 rounded-t-sm font-medium border-b-4 border-gray-400 bg-gray-300',
      preview:
        'w-16 px-3 py-0.5 rounded-b-sm text-xs font-medium border-t-4 border-gray-400 bg-gray-300',
    },
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <div className="space-x-0.5">
          <button
            onClick={() => setTab(ETab.HTML)}
            className={`${styles.action.lang} ${
              tab === ETab.HTML ? styles.tab.active : ''
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setTab(ETab.CSS)}
            className={`${styles.action.lang} ${
              tab === ETab.CSS ? styles.tab.active : ''
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setTab(ETab.JS)}
            className={`${styles.action.lang} ${
              tab === ETab.JS ? styles.tab.active : ''
            }`}
          >
            JAVASCRIPT
          </button>
        </div>
        <button
          onClick={() => setTab(ETab.RESULT)}
          className={`${styles.action.lang} ${
            tab === ETab.RESULT ? styles.tab.active : ''
          }`}
        >
          Result
        </button>
      </div>

      {/* Panel */}
      <div className="relative w-full h-72 bg-white">
        {creation ? (
          <>
            {tab === ETab.RESULT ? (
              <CreationFrame
                key={random}
                title={creation.title}
                html={creation.code_html}
                css={creation.code_css}
                js={creation.code_js}
              />
            ) : (
              <div className="flex h-full overflow-hidden">
                <div className="relative w-7/12 h-full text-white">
                  {tab === ETab.HTML && (
                    <CodeEditor
                      lang={ECodeEditorLanguage.HTML}
                      value={creation.code_html}
                      defaultValue="<!-- Text HTML here... -->"
                      readOnly
                    />
                  )}
                  {tab === ETab.CSS && (
                    <CodeEditor
                      lang={ECodeEditorLanguage.CSS}
                      value={creation.code_css}
                      defaultValue="/* Text CSS here... */"
                      readOnly
                    />
                  )}
                  {tab === ETab.JS && (
                    <CodeEditor
                      lang={ECodeEditorLanguage.JS}
                      value={creation.code_js}
                      defaultValue="// Text JavaScript here..."
                      // readOnly
                    />
                  )}
                </div>
                <div className="relative w-5/12 h-full">
                  <CreationFrame
                    key={random}
                    title={creation.title}
                    html={creation.code_html}
                    css={creation.code_css}
                    js={creation.code_js}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
      <div
        className={`flex ${
          tab === ETab.RESULT ? 'justify-end' : 'justify-between'
        }`}
      >
        {/* <div className="space-x-0.5">
          <button className={`${styles.action.preview}`}>1.0</button>
          <button className={`${styles.action.preview}`}>0.5</button>
          <button className={`${styles.action.preview}`}>0.25</button>
        </div> */}
        {tab !== ETab.RESULT && (
          <button
            onClick={handleSwitchTheme}
            className={`${styles.action.preview}`}
          >
            {theme === ECodeEditorTheme.GH_LIGHT ? 'Light' : 'Dark'}
          </button>
        )}

        <button
          onClick={() => setRandom((value) => (value += 1))}
          className={`${styles.action.preview}`}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
