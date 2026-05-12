import {
  getEdgeByIndex,
  getEntity,
  summarizeVerification,
} from '../lib/selectors'

interface Props {
  edgeIndex: number
}

export function EdgePopover({ edgeIndex }: Props) {
  const edge = getEdgeByIndex(edgeIndex)
  if (!edge) return null

  const fromEntity = getEntity(edge.from)
  const toEntity = getEntity(edge.to)
  const isDemoted = edge.verification.status === 'demoted'

  return (
    <div className="font-mono text-sm space-y-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-black/50">
          Edge
        </div>
        <div className="text-base font-bold flex items-center gap-2">
          <span>{fromEntity?.name ?? edge.from}</span>
          <span className={edge.type === 'flow' ? 'text-flow' : 'text-ink'}>
            {edge.type === 'flow' ? '→' : '⇢'}
          </span>
          <span>{toEntity?.name ?? edge.to}</span>
        </div>
        <div className="text-xs text-black/60 mt-0.5">
          type: <span className="font-bold">{edge.type}</span>
        </div>
      </div>

      <div
        className={`border rounded px-2 py-2 text-xs ${
          isDemoted
            ? 'border-flow/60 bg-flow/5'
            : 'border-black/20 bg-black/5'
        }`}
      >
        <div className="uppercase tracking-wider text-black/50">
          Edge verification
        </div>
        <div className={`font-bold ${isDemoted ? 'text-flow' : ''}`}>
          {isDemoted ? '⚠ ' : '✓ '}
          {summarizeVerification(edge.verification)}
        </div>
        {edge.verification.details && (
          <div className="mt-1 italic text-black/70 whitespace-pre-wrap">
            {edge.verification.details}
          </div>
        )}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-black/50 mb-1">
          Evidences ({edge.evidences.length})
        </div>
        <ul className="space-y-2">
          {edge.evidences.map((ev, idx) => {
            const evDemoted = ev.verification.status === 'demoted'
            return (
              <li
                key={idx}
                className={`border rounded px-2 py-2 text-xs ${
                  evDemoted
                    ? 'border-flow/40 bg-flow/5'
                    : 'border-black/15 bg-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{ev.kind}</span>
                  <span className={evDemoted ? 'text-flow' : 'text-black/50'}>
                    {evDemoted ? '⚠ demoted' : '✓ verified'}
                  </span>
                </div>
                <div className="mt-1 text-black/60">
                  refs: {ev.refs.join(', ')}
                </div>
                {evDemoted && ev.verification.failure_codes?.length > 0 && (
                  <div className="mt-1">
                    <span className="text-black/50">codes: </span>
                    <span className="text-flow">
                      {ev.verification.failure_codes.join(', ')}
                    </span>
                  </div>
                )}
                {evDemoted && ev.verification.details && (
                  <div className="mt-1 italic text-black/70 whitespace-pre-wrap">
                    {ev.verification.details}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}