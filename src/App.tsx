import { BoardCanvas } from './components/BoardCanvas'
import { DetailPanel } from './components/DetailPanel'
import { bakerstreetData } from './data'

function App() {
  const { stats, meta } = bakerstreetData

  return (
    <div className="h-screen flex flex-col">
      <header className="px-6 py-3 border-b border-black/20 font-mono shrink-0">
        <h1 className="text-lg">BakerStreet — Stage 5 / interactive</h1>
        <p className="text-xs mt-1 text-black/70">
          {stats.edges_total} edges · {stats.edges_verified} verified ·{' '}
          <span className="text-flow">
            {stats.edges_demoted} demoted
          </span>{' '}
          · model {meta.model_used}
        </p>
      </header>
      <main className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0">
          <BoardCanvas />
        </div>
        <DetailPanel />
      </main>
    </div>
  )
}

export default App