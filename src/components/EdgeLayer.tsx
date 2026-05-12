import { useGraphStore } from '../store/graphStore'
import { useUIStore } from '../store/uiStore'
import { cardCenter, CARD_W, CARD_H } from '../lib/layout'
import type { Edge, Node } from '../types/bakerstreet'

// edge 양 끝을 카드 경계까지만 그리도록 줄여서 화살표가 박혀 보이지 않게.
// 정확한 박스-라인 교차는 over-engineering이라 단순 비례 축약.
function trimToBox(
  fromCx: number,
  fromCy: number,
  toCx: number,
  toCy: number,
  pad: number
) {
  const dx = toCx - fromCx
  const dy = toCy - fromCy
  const dist = Math.hypot(dx, dy) || 1
  // 양쪽 끝에서 pad만큼 잘라냄
  const ratioStart = pad / dist
  const ratioEnd = (dist - pad) / dist
  return {
    x1: fromCx + dx * ratioStart,
    y1: fromCy + dy * ratioStart,
    x2: fromCx + dx * ratioEnd,
    y2: fromCy + dy * ratioEnd,
  }
}

interface SingleEdgeProps {
  edge: Edge
  index: number
  from: Node
  to: Node
}

function SingleEdge({ edge, index, from, to }: SingleEdgeProps) {
  const selectedEdgeIndex = useUIStore((s) => s.selectedEdgeIndex)
  const selectEdge = useUIStore((s) => s.selectEdge)

  const fromCenter = cardCenter(from.x, from.y)
  const toCenter = cardCenter(to.x, to.y)
  // pad ≈ 카드 박스 반대각선 절반보다 살짝 짧게
  const pad = Math.max(CARD_W, CARD_H) / 2 + 4
  const { x1, y1, x2, y2 } = trimToBox(
    fromCenter.cx,
    fromCenter.cy,
    toCenter.cx,
    toCenter.cy,
    pad
  )

  const isFlow = edge.type === 'flow'
  const isDemoted = edge.verification.status === 'demoted'
  const isSelected = selectedEdgeIndex === index

  const baseColor = isDemoted
    ? '#9CA3AF'              // demoted → gray
    : isFlow
      ? '#B22222'            // verified flow → red
      : '#4A6FA5'            // verified shared_attribute → ink blue

  const strokeWidth = isFlow ? 2 : 1.5
  const dasharray = isFlow ? undefined : '6 4'
  const opacity = isDemoted ? 0.45 : 0.9
  const ringWidth = strokeWidth + 8 // 클릭 hitbox 두께

  // marker arrow는 flow에만, demoted 여부에 따라 마커 id 분리
  const markerId = isFlow
    ? isDemoted
      ? 'arrow-flow-demoted'
      : 'arrow-flow'
    : undefined

  return (
    <g
      onClick={(e) => {
        e.stopPropagation()
        selectEdge(index)
      }}
      className="cursor-pointer"
    >
      {/* invisible thick line for easier clicking */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={ringWidth}
      />
      {/* visible edge */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={baseColor}
        strokeWidth={isSelected ? strokeWidth + 1.5 : strokeWidth}
        strokeDasharray={dasharray}
        opacity={opacity}
        markerEnd={markerId ? `url(#${markerId})` : undefined}
      />
      {/* demoted ⚠ 아이콘 — edge midpoint */}
      {isDemoted && (
        <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}>
          <circle r={10} fill="#FDF5E6" stroke="#B22222" strokeWidth={1.5} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill="#B22222"
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}
    </g>
  )
}

export function EdgeLayer() {
  const edges = useGraphStore((s) => s.edges)
  const nodes = useGraphStore((s) => s.nodes)

  return (
    <g>
      {/* arrow marker defs */}
      <defs>
        <marker
          id="arrow-flow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#B22222" />
        </marker>
        <marker
          id="arrow-flow-demoted"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF" />
        </marker>
      </defs>

      {edges.map((edge, idx) => {
        const from = nodes.find((n) => n.id === edge.from)
        const to = nodes.find((n) => n.id === edge.to)
        if (!from || !to) return null
        return (
          <SingleEdge key={idx} edge={edge} index={idx} from={from} to={to} />
        )
      })}
    </g>
  )
}