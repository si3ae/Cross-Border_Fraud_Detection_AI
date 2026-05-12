import { setNodePositions, useGraphStore } from '../store/graphStore'
import { computeLayout } from './layout'

// 앱 부팅 시 한 번만 호출. 좌표를 graphStore에 쓴다.
export function initLayout() {
  const entities = useGraphStore.getState().nodes
  const positions = computeLayout(entities)
  setNodePositions(positions)
}