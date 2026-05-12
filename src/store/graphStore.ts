import { create } from 'zustand'
import type { Entity, Edge } from '../types/bakerstreet'
import { bakerstreetData } from '../data'

// 노드 = entity + 좌표. 좌표는 layout 단계에서 채움 (Step 4).
export interface Node extends Entity {
  x: number
  y: number
}

interface GraphState {
  nodes: Node[]
  edges: Edge[]
  pattern: string
  // selector helpers
  getNode: (id: string) => Node | undefined
  getConnectedEdges: (entityId: string) => Edge[]
}

// 초기 hydrate — 좌표 없이 entity만 넣어두고 Step 4에서 layout으로 채움.
const initialNodes: Node[] = bakerstreetData.entities.map((e) => ({
  ...e,
  x: 0,
  y: 0,
}))

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initialNodes,
  edges: bakerstreetData.edges,
  pattern: bakerstreetData.meta.gemma_pattern,

  getNode: (id) => get().nodes.find((n) => n.id === id),
  getConnectedEdges: (entityId) =>
    get().edges.filter((e) => e.from === entityId || e.to === entityId),
}))

// nodes 좌표를 외부에서 한 번에 주입하기 위한 setter (layout 계산용)
export const setNodePositions = (
  positions: Record<string, { x: number; y: number }>
) => {
  useGraphStore.setState((state) => ({
    nodes: state.nodes.map((n) =>
      positions[n.id] ? { ...n, x: positions[n.id].x, y: positions[n.id].y } : n
    ),
  }))
}