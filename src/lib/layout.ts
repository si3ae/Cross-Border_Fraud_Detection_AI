import type { Entity } from '../types/bakerstreet'

// design.md: viewBox 0 0 1200 800
export const VIEW_W = 1200
export const VIEW_H = 800

// 카드 placeholder 박스 (Stage 5는 색 블록만)
export const CARD_W = 140
export const CARD_H = 80

// node "center"는 placeholder 박스의 가운데. edge는 center → center.
export const cardCenter = (x: number, y: number) => ({
  cx: x + CARD_W / 2,
  cy: y + CARD_H / 2,
})

// jurisdiction별 컬럼 배치. 같은 컬럼 안에선 세로로 stack.
// 컬럼 수가 가변이라 동적 분할.
export function computeLayout(
  entities: Entity[]
): Record<string, { x: number; y: number }> {
  // jurisdiction별 그룹핑, 안정적 정렬
  const grouped = new Map<string, Entity[]>()
  entities.forEach((e) => {
    const key = e.jurisdiction || 'Unknown'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(e)
  })

  const jurisdictions = Array.from(grouped.keys()).sort()
  const colCount = jurisdictions.length

  // 가로 padding + 컬럼 균등 분포
  const padX = 80
  const padY = 100
  const usableW = VIEW_W - padX * 2
  const usableH = VIEW_H - padY * 2
  const colStep = colCount > 1 ? usableW / (colCount - 1) : 0

  const positions: Record<string, { x: number; y: number }> = {}

  jurisdictions.forEach((juris, colIdx) => {
    const group = grouped.get(juris)!
    const rowCount = group.length
    const rowStep = rowCount > 1 ? usableH / (rowCount - 1) : 0
    const colX = colCount > 1 ? padX + colIdx * colStep : VIEW_W / 2
    // 컬럼 중앙 정렬을 위해 카드 좌상단 좌표를 center에서 offset
    group.forEach((entity, rowIdx) => {
      const rowY =
        rowCount > 1 ? padY + rowIdx * rowStep : VIEW_H / 2
      positions[entity.id] = {
        x: colX - CARD_W / 2,
        y: rowY - CARD_H / 2,
      }
    })
  })

  return positions
}