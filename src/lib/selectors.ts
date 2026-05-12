// src/lib/selectors.ts
import { bakerstreetData } from '../data'
import type { Edge, Entity, Verification } from '../types/bakerstreet'

export function getEntity(id: string): Entity | undefined {
  return bakerstreetData.entities.find((e) => e.id === id)
}

export interface EntityEdgeSummary {
  total: number
  verified: number
  demoted: number
  edges: Array<{ index: number; edge: Edge; direction: 'out' | 'in' }>
}

export function getEntityEdgeSummary(entityId: string): EntityEdgeSummary {
  const edges = bakerstreetData.edges
  const collected: EntityEdgeSummary['edges'] = []
  edges.forEach((edge, index) => {
    if (edge.from === entityId) collected.push({ index, edge, direction: 'out' })
    else if (edge.to === entityId) collected.push({ index, edge, direction: 'in' })
  })
  return {
    total: collected.length,
    verified: collected.filter((c) => c.edge.verification.status === 'verified')
      .length,
    demoted: collected.filter((c) => c.edge.verification.status === 'demoted')
      .length,
    edges: collected,
  }
}

export function getEdgeByIndex(index: number): Edge | undefined {
  return bakerstreetData.edges[index]
}

export function summarizeVerification(v: Verification): string {
  if (v.status === 'verified') return 'verified'
  const codes = v.failure_codes?.length ? v.failure_codes.join(', ') : 'demoted'
  return codes
}