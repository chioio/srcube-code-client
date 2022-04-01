import Split from 'react-split'
import { CodePanel } from './CodePanel'
import { PreviewPanel } from './PreviewPanel'

const GUTTER_SIZE = 16
const SNAP_OFFSET = 0

export const TopView: React.VFC<any> = () => {
  return (
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
        minSize={[40, 40, 40]}
        snapOffset={SNAP_OFFSET}
        cursor="col-resize"
        className="flex flex-row px-3 pt-3 bg-gray-100 split-panel"
      >
        <CodePanel lang="html" />
        <CodePanel lang="css" />
        <CodePanel lang="javascript" />
      </Split>
      <PreviewPanel />
    </Split>
  )
}

export const LeftView: React.VFC<any> = () => {
  return (
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
      <PreviewPanel />
    </Split>
  )
}

export const RightView: React.VFC<any> = () => {
  return (
    <Split
      direction="horizontal"
      gutterSize={GUTTER_SIZE}
      minSize={0}
      maxSize={[1200, Infinity]}
      snapOffset={0}
      cursor="col-resize"
      className="flex flex-row split-panel"
    >
      <PreviewPanel />
      <Split
        direction="vertical"
        gutterSize={GUTTER_SIZE}
        minSize={[40, 40, 40]}
        snapOffset={0}
        cursor="row-resize"
        className="py-3 pr-3 bg-gray-100 split-panel"
      >
        <CodePanel lang="html" />
        <CodePanel lang="css" />
        <CodePanel lang="javascript" />
      </Split>
    </Split>
  )
}
