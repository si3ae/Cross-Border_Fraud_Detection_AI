import { getEntity, getEntityEdgeSummary } from '../lib/selectors'
import { useUIStore } from '../store/uiStore'

interface Props {
  entityId: string
}

export function EntityPopover({ entityId }: Props) {
  const entity = getEntity(entityId)
  const summary = getEntityEdgeSummary(entityId)
  const selectEdge = useUIStore((s) => s.selectEdge)

  if (!entity) return null

  return (
    <div className="font-mono text-sm space-y-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-black/50">
          Entity
        </div>
        <div className="text-base font-bold">{entity.name}</div>
        <div className="text-xs text-black/60 mt-0.5">{entity.id}</div>
        <div className="text-xs mt-1">
          jurisdiction:{' '}
          <span className="text-ink font-bold">{entity.jurisdiction}</span>
        </div>
      </div>

      <div className="border-t border-black/15 pt-2">
        <div className="text-xs uppercase tracking-wider text-black/50 mb-1">
          Connected edges
        </div>
        <div className="text-xs mb-2">
          total {summary.total} · {summary.verified} verified ·{' '}
          <span className="text-flow">{summary.demoted} demoted</span>
        </div>
        <ul className="space-y-1 max-h-72 overflow-auto">
          {summary.edges.map(({ index, edge, direction }) => {
            const other = direction === 'out' ? edge.to : edge.from
            const arrow = direction === 'out' ? '→' : '←'
            const demoted = edge.verification.status === 'demoted'
            return (
              <li key={index}>
                <button
                  onClick={() => selectEdge(index)}
                  className="text-left w-full hover:bg-black/5 px-1 py-0.5 text-xs"
                >
                  <span className="text-black/50">[{edge.type}]</span> {arrow}{' '}
                  <span className="text-black/80">{other}</span>{' '}
                  {demoted ? (
                    <span className="text-flow">⚠ demoted</span>
                  ) : (
                    <span className="text-black/40">verified</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}