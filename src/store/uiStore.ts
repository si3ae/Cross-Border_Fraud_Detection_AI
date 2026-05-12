import { create } from 'zustand'

// Stage 5에선 popover 타겟만. ripple/activeEdges는 Stage 6에서 추가.
interface UIState {
  selectedEntityId: string | null
  selectedEdgeIndex: number | null // edge에 id가 없어서 인덱스로 관리

  selectEntity: (id: string | null) => void
  selectEdge: (index: number | null) => void
  clearSelection: () => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedEntityId: null,
  selectedEdgeIndex: null,

  selectEntity: (id) =>
    set({ selectedEntityId: id, selectedEdgeIndex: null }),
  selectEdge: (index) =>
    set({ selectedEdgeIndex: index, selectedEntityId: null }),
  clearSelection: () =>
    set({ selectedEntityId: null, selectedEdgeIndex: null }),
}))