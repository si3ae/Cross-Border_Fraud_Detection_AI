import { useGraphStore } from '../store/graphStore'
import { useUIStore } from '../store/uiStore'
import { CARD_W, CARD_H } from '../lib/layout'

// jurisdiction별 색 토큰 (placeholder)
const JURISDICTION_COLORS: Record<string, string> = {
  BVI: '#5B7C99',
  Panama: '#A06846',
  Cyprus: '#8B7355',
  Singapore: '#6B8E4E',
  Malta: '#9C6B6B',
  'Cayman Islands': '#7A6B8E',
  Luxembourg: '#8E7A4B',
}

const DEFAULT_COLOR = '#6B7280'

interface CardProps {
  entityId: string
}

export function Card({ entityId }: CardProps) {
  const node = useGraphStore((s) => s.nodes.find((n) => n.id === entityId))
  const selectedEntityId = useUIStore((s) => s.selectedEntityId)
  const selectEntity = useUIStore((s) => s.selectEntity)

  if (!node) return null

  const color = JURISDICTION_COLORS[node.jurisdiction] ?? DEFAULT_COLOR
  const isSelected = selectedEntityId === entityId

  // 회사명 너무 길면 truncate (carrier names 일부 25자 넘음)
  const displayName =
    node.name.length > 22 ? node.name.slice(0, 21) + '…' : node.name

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={(e) => {
        e.stopPropagation()
        selectEntity(entityId)
      }}
      className="cursor-pointer"
    >
      <rect
        width={CARD_W}
        height={CARD_H}
        fill={color}
        stroke={isSelected ? '#B22222' : '#2D2D2D'}
        strokeWidth={isSelected ? 3 : 1.5}
        rx={4}
      />
      {/* jurisdiction tag */}
      <rect width={CARD_W} height={20} fill="rgba(0,0,0,0.25)" rx={4} />
      <text
        x={CARD_W / 2}
        y={14}
        textAnchor="middle"
        fontSize={11}
        fill="#FDF5E6"
        fontFamily="'Courier Prime', monospace"
        fontWeight="bold"
      >
        {node.jurisdiction}
      </text>
      {/* entity name */}
      <text
        x={CARD_W / 2}
        y={48}
        textAnchor="middle"
        fontSize={10}
        fill="#FDF5E6"
        fontFamily="'Courier Prime', monospace"
      >
        {displayName}
      </text>
      {/* entity id (small) */}
      <text
        x={CARD_W / 2}
        y={66}
        textAnchor="middle"
        fontSize={8}
        fill="rgba(253,245,230,0.7)"
        fontFamily="'Courier Prime', monospace"
      >
        {entityId}
      </text>
    </g>
  )
}