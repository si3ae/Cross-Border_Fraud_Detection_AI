import { useEffect } from 'react'
import { useGraphStore } from '../store/graphStore'
import { useUIStore } from '../store/uiStore'
import { initLayout } from '../lib/initLayout'
import { VIEW_W, VIEW_H } from '../lib/layout'
import { EdgeLayer } from './EdgeLayer'
import { Card } from './Card'

export function BoardCanvas() {
  const nodes = useGraphStore((s) => s.nodes)
  const clearSelection = useUIStore((s) => s.clearSelection)

  // mount 시 한 번 layout 계산
  useEffect(() => {
    initLayout()
  }, [])

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-full"
      onClick={clearSelection}
    >
      {/* edges 먼저 (카드 뒤에) */}
      <EdgeLayer />
      {nodes.map((n) => (
        <Card key={n.id} entityId={n.id} />
      ))}
    </svg>
  )
}