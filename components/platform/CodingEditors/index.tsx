import { SPLIT_GUTTER_SIZE, SPLIT_SNAP_OFFSET } from '@lib/constants'
import { EViewDirection, useCoding } from '@lib/context/CodingContext'
import Split from 'react-split'
import { CodeEditor, ECodeEditorLanguage } from '..'

interface ICodingEditors {
  code: {
    html?: string
    css?: string
    js?: string
  }
}

export const CodingEditors: React.FC<ICodingEditors> = ({ code }) => {
  const { creation, direction, dispatch } = useCoding()

  return (
    <Split
      direction={direction === EViewDirection.TOP ? 'horizontal' : 'vertical'}
      gutterSize={SPLIT_GUTTER_SIZE}
      minSize={[40, 40, 40]}
      snapOffset={direction === EViewDirection.TOP ? SPLIT_SNAP_OFFSET : 0}
      cursor="col-resize"
      className={`${
        direction === EViewDirection.TOP ? 'flex flex-row' : ''
      } border-gray-100 split-panel`}
    >
      {/* HTML */}
      <div className="flex flex-col overflow-hidden">
        <PanelHeader
          lang={ECodeEditorLanguage.HTML}
          icon={<HtmlSVG w={20} h={20} />}
        />
        <div className="h-0 flex-grow bg-white overflow-hidden">
          <CodeEditor
            lang={ECodeEditorLanguage.HTML}
            value={code.html || ''}
            defaultValue="<!-- Write your html code here... -->"
            onChange={(value) =>
              dispatch({
                type: 'SET_CREATION',
                payload: {
                  creation: {
                    ...creation,
                    code_html: value || '',
                  },
                },
              })
            }
          />
        </div>
      </div>
      {/* CSS */}
      <div className="flex flex-col overflow-hidden">
        <PanelHeader
          lang={ECodeEditorLanguage.CSS}
          icon={<CssSVG w={20} h={20} />}
        />
        <div className="h-0 flex-grow px-0.5 pb-0.5 bg-white overflow-hidden">
          <CodeEditor
            lang={ECodeEditorLanguage.CSS}
            value={code.css || ''}
            defaultValue="/* Write your css code here... */"
            onChange={(value) =>
              dispatch({
                type: 'SET_CREATION',
                payload: {
                  creation: {
                    ...creation,
                    code_css: value || '',
                  },
                },
              })
            }
          />
        </div>
      </div>
      {/* JS */}
      <div className="flex flex-col overflow-hidden">
        <PanelHeader
          lang={ECodeEditorLanguage.JS}
          icon={<JsSVG w={20} h={20} />}
        />
        <div className="h-0 flex-grow px-0.5 pb-0.5 bg-white overflow-hidden">
          <CodeEditor
            lang={ECodeEditorLanguage.JS}
            value={code.js || ''}
            defaultValue="// Write your script code here..."
            onChange={(value) =>
              dispatch({
                type: 'SET_CREATION',
                payload: {
                  creation: {
                    ...creation,
                    code_js: value || '',
                  },
                },
              })
            }
          />
        </div>
      </div>
    </Split>
  )
}

const PanelHeader: React.FC<{
  lang: ECodeEditorLanguage
  icon: JSX.Element
}> = ({ lang, icon }) => {
  return (
    <div className="flex-none flex items-center py-2 px-3 w-full border-b border-gray-100 bg-white dark:bg-gray-900">
      <div className="flex items-center">
        {icon}
        <h2 className="ml-2 font-bold text-gray-700 dark:text-gray-200">
          {lang.toUpperCase()}
        </h2>
      </div>
    </div>
  )
}

const HtmlSVG = ({ w, h }: { w: number; h: number }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-icon="css3"
    width={w}
    height={h}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
  >
    <path
      fill="#ef4444"
      d="M52,64H12C5.4,64,0,58.6,0,52V12C0,5.4,5.4,0,12,0H52c6.6,0,12,5.4,12,12V52C64,58.6,58.6,64,52,64z"
    />
    <g>
      <path
        fill="#FFFFFF"
        d="M18.7,23.3c0.4-0.1,0.9-0.3,1.3-0.3c1.9,0,3,1.3,3,3.2c0,1.6-1,2.8-2.9,3.2L10.8,32v0.3l9.3,2.8
		c1.9,0.6,2.9,1.6,2.9,3.3c0,1.9-1.3,3.2-3,3.2c-0.4,0-0.9-0.1-1.5-0.3l-9.3-3.8c-3-1.2-4.1-2.8-4.1-5.2c0-2.6,1.2-4.4,4.1-5.4
		L18.7,23.3z"
      />
      <path
        fill="#FFFFFF"
        d="M28.5,47.1c-1.6,0-2.9-1.3-2.8-2.9c0-0.4,0.1-0.7,0.1-1l6.8-24.2c0.4-1.3,1.5-2,2.8-2c1.6,0,2.9,1.3,2.8,2.9
		c0,0.4-0.1,0.7-0.1,1l-6.8,24.2C30.8,46.4,29.8,47.1,28.5,47.1z"
      />
      <path
        fill="#FFFFFF"
        d="M58.8,32.3c0,2.5-1,4.1-4.1,5.2l-9.3,3.8c-0.6,0.1-0.9,0.3-1.5,0.3c-1.7,0-3-1.3-3-3.2c0-1.6,1-2.8,2.9-3.3
		l9.3-2.8V32l-9.3-2.5C42,29.1,41,27.9,41,26.3c0-1.9,1.3-3.2,3-3.2c0.4,0,0.9,0,1.3,0.3l9.4,3.5C57.7,27.9,58.8,29.7,58.8,32.3z"
      />
    </g>
  </svg>
)

const CssSVG = ({ w, h }: { w: number; h: number }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-icon="css3"
    width={w}
    height={h}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
  >
    <path
      fill="#38bdf8"
      d="M52,64H12C5.4,64,0,58.6,0,52V12C0,5.4,5.4,0,12,0H52c6.6,0,12,5.4,12,12V52C64,58.6,58.6,64,52,64z"
    />
    <g>
      <path
        fill="#FFFFFF"
        d="M44.2,45.1c0,2.4-1.9,4.5-4.5,4.5c-1.9,0-3.5-1.2-4.2-3l-3.5-9l-3.5,9c-0.7,1.6-2.3,3-4.2,3
		c-2.4,0-4.5-2.1-4.5-4.5c0-1,0.3-2.1,1-3l6.3-7.5c-9,1.6-10.1,1.7-10.4,1.7c-2.4,0-4.5-2.1-4.5-4.5s2.1-4.5,4.5-4.5
		c0.2,0,1.4,0.2,10.4,1.7l-6.3-7.5c-0.7-0.7-1-1.7-1-2.8c0-2.4,2.1-4.5,4.5-4.5c1.9,0,3.7,1.2,4.2,3l3.5,9.2l3.5-9.2
		c0.5-1.7,2.3-3,4.2-3c2.4,0,4.5,2.1,4.5,4.5c0,1-0.3,2.1-1,2.8l-6.3,7.5c9-1.6,10.1-1.7,10.4-1.7c2.4,0,4.5,2.1,4.5,4.5
		s-2.1,4.5-4.5,4.5c-0.2,0-1.4-0.2-10.4-1.7l6.3,7.5C43.8,43,44.2,44.1,44.2,45.1z"
      />
    </g>
  </svg>
)

const JsSVG = ({ w, h }: { w: number; h: number }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-icon="css3"
    width={w}
    height={h}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
  >
    <path
      fill="#fcd34d"
      d="M52,64H12C5.4,64,0,58.6,0,52V12C0,5.4,5.4,0,12,0H52c6.6,0,12,5.4,12,12V52C64,58.6,58.6,64,52,64z"
    />
    <g>
      <path
        fill="#FFFFFF"
        d="M12.7,32c0-9.5,3.3-14.8,4.7-16.7c1.2-1.6,2.5-2.1,3.5-2.1c2.1,0,3.3,1.4,3.3,3.1c0,1-0.2,1.9-0.4,2.5
		c-1,3.1-2.7,7-2.7,13.2s1.6,10.1,2.7,13.2c0.2,0.8,0.4,1.4,0.4,2.5c0,1.6-1.2,3.1-3.3,3.1c-1,0-2.1-0.4-3.5-2.1
		C16,46.8,12.7,41.5,12.7,32z"
      />
      <path
        fill="#FFFFFF"
        d="M43.1,50.7c-2.1,0-3.3-1.4-3.3-3.1c0-1,0.2-1.9,0.4-2.5c1-3.1,2.7-7,2.7-13.2c0-6-1.6-10.1-2.7-13.2
		c-0.2-0.8-0.4-1.4-0.4-2.5c0-1.6,1.2-3.1,3.3-3.1c1,0,2.1,0.4,3.5,2.1c1.4,1.9,4.7,7.2,4.7,16.7S48,46.8,46.6,48.7
		C45.4,50.3,44.1,50.7,43.1,50.7z"
      />
    </g>
  </svg>
)
