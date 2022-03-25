import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Split from 'react-split'

import { codeState, viewDirectionState, workState } from '@lib/store/atoms'
import { Layout } from '@components/common'
import { CodePanel, HeaderPanel, PreviewPanel } from '@components/coding'

const GUTTER_SIZE = 16
const SNAP_OFFSET = 0

const Coding: NextPage = () => {
  const code = useRecoilValue(codeState)

  const direction = useRecoilValue(viewDirectionState)

  return (
    <>
      <Layout>
        <HeaderPanel />
        <main className="flex-grow flex flex-col border-t border-slate-200">
          {direction === 'left' && (
            <Split
              direction="horizontal"
              gutterSize={GUTTER_SIZE}
              minSize={0}
              maxSize={[Infinity, 1200]}
              snapOffset={0}
              cursor="col-resize"
              className="flex flex-row border-t border-slate-200 split-panel"
            >
              <Split
                direction="vertical"
                gutterSize={GUTTER_SIZE}
                minSize={[40, 40, 40]}
                snapOffset={0}
                cursor="row-resize"
                className="py-3 pl-3 bg-gray-100 split-panel"
              >
                <CodePanel lang="html" />
                <CodePanel lang="css" />
                <CodePanel lang="javascript" />
              </Split>
              <div>
                <PreviewPanel
                  code={{
                    html: code.html,
                    css: code.css,
                    javascript: code.javascript,
                  }}
                  title="test"
                />
              </div>
            </Split>
          )}
          {direction === 'top' && (
            <Split
              direction="vertical"
              gutterSize={GUTTER_SIZE}
              minSize={[100, 0]}
              snapOffset={SNAP_OFFSET}
              cursor="row-resize"
              className="border-t border-slate-200 split-panel"
            >
              <Split
                direction="horizontal"
                gutterSize={GUTTER_SIZE}
                minSize={43}
                snapOffset={SNAP_OFFSET}
                cursor="col-resize"
                className="flex flex-row px-3 pt-3 bg-gray-100 split-panel"
              >
                <CodePanel lang="html" />
                <CodePanel lang="css" />
                <CodePanel lang="javascript" />
              </Split>
              <div>
                <PreviewPanel
                  code={{
                    html: code.html,
                    css: code.css,
                    javascript: code.javascript,
                  }}
                  title="test"
                />
              </div>
            </Split>
          )}
          {direction === 'right' && (
            <Split
              direction="horizontal"
              gutterSize={GUTTER_SIZE}
              minSize={0}
              maxSize={[1200, Infinity]}
              snapOffset={0}
              cursor="col-resize"
              className="flex flex-row split-panel"
            >
              <div>
                <PreviewPanel
                  code={{
                    html: code.html,
                    css: code.css,
                    javascript: code.javascript,
                  }}
                  title="test"
                />
              </div>
              <Split
                direction="vertical"
                gutterSize={GUTTER_SIZE}
                minSize={40}
                snapOffset={0}
                cursor="row-resize"
                className="py-3 pr-3 bg-gray-100 split-panel"
              >
                <CodePanel lang="html" />
                <CodePanel lang="css" />
                <CodePanel lang="javascript" />
              </Split>
            </Split>
          )}
        </main>
      </Layout>
    </>
  )
}

export default Coding
