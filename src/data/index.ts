import rawJson from './bakerstreet_frontend.json'
import type { BakerStreetData } from '../types/bakerstreet'

// JSON은 구조상 타입을 좁힐 수 없어서 한 번만 cast.
// 이후 모든 접근은 BakerStreetData 타입으로.
export const bakerstreetData = rawJson as unknown as BakerStreetData