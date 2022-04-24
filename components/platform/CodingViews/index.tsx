import Split from 'react-split'
import { CodingFrame } from '../CodingFrame'

const GUTTER_SIZE = 16
const SNAP_OFFSET = 0

export const TopView: React.VFC<any> = ({ children }) => {
  return (
    <Split
      direction="vertical"
      gutterSize={GUTTER_SIZE}
      minSize={[100, 0]}
      snapOffset={SNAP_OFFSET}
      cursor="row-resize"
      className="border-t border-slate-200 split-panel"
    >
      {children}
      <CodingFrame />
    </Split>
  )
}

export const LeftView: React.VFC<any> = ({ children }) => {
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
      {children}
      <CodingFrame />
    </Split>
  )
}

export const RightView: React.VFC<any> = ({ children }) => {
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
      <CodingFrame />
      {children}
    </Split>
  )
}
