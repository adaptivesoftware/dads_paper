import { useEffect, useRef, useState } from 'react'
import type { GLViewer } from '3dmol'
import { Atom, Database, FlaskConical, Orbit } from 'lucide-react'

const LEVELS = ['F16', 'F40', 'F52', 'F64'] as const

export type FluorinationLevel = (typeof LEVELS)[number]

type LevelMeta = {
  code: string
  formula: string
  fluorines: number
  crowding: string
  aggregation: string
  symmetry: string
  source: string
}

const MODEL_FILES: Record<FluorinationLevel, string> = {
  F16: '/structures/F16.sdf',
  F40: '/structures/F40.sdf',
  F52: '/structures/F52.sdf',
  F64: '/structures/F64.sdf',
}

const LEVEL_META: Record<FluorinationLevel, LevelMeta> = {
  F16: {
    code: 'F16PcZn',
    formula: 'C32F16N8Zn',
    fluorines: 16,
    crowding: 'Low steric crowding around the macrocycle perimeter.',
    aggregation: 'Higher dimer tendency via π-π stacking interactions.',
    symmetry: 'Near D4h-like benchmark scaffold in idealized form.',
    source: 'PubChem CID 11377956 (direct SDF molecular graph).',
  },
  F40: {
    code: 'F40PcZn',
    formula: 'C44F40N8Zn',
    fluorines: 40,
    crowding: 'Bulky heptafluoropropan-2-yl groups create clear steric shielding.',
    aggregation: 'Mixed monomer/dimer behavior with broadened Q-region features.',
    symmetry: 'C2v-like substitution pattern used for derived model.',
    source: 'Derived from F64 topology by removing 4 bulky groups and restoring aromatic F.',
  },
  F52: {
    code: 'F52PcZn',
    formula: 'C50F52N8Zn',
    fluorines: 52,
    crowding: 'Denser bulky-group coverage increases out-of-plane congestion.',
    aggregation: 'Lower dimer fraction than F16/F40 in solution.',
    symmetry: 'C2v-like substitution pattern used for derived model.',
    source: 'Derived from F64 topology by removing 2 bulky groups and restoring aromatic F.',
  },
  F64: {
    code: 'F64PcZn',
    formula: 'C56F64N8Zn',
    fluorines: 64,
    crowding: 'Maximum peripheral congestion from 8 bulky heptafluoropropan-2-yl groups.',
    aggregation: 'Predominantly monomeric behavior under reported conditions.',
    symmetry: 'Nominal D4h-like parent arrangement with maximal steric shielding.',
    source: 'PubChem CID 9964044 (direct SDF molecular graph).',
  },
}

export function MolecularViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<GLViewer | null>(null)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(true)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [modelMap, setModelMap] = useState<Record<FluorinationLevel, string>>({
    F16: '',
    F40: '',
    F52: '',
    F64: '',
  })

  const selectedLevel = LEVELS[selectedIndex]
  const selectedMeta = LEVEL_META[selectedLevel]

  useEffect(() => {
    let mounted = true

    const loadModels = async () => {
      try {
        const entries = await Promise.all(
          LEVELS.map(async (level) => {
            const response = await fetch(MODEL_FILES[level])
            if (!response.ok) {
              throw new Error(`Failed to load ${MODEL_FILES[level]}`)
            }
            const sdf = await response.text()
            return [level, sdf] as const
          }),
        )

        if (!mounted) {
          return
        }

        setModelMap(
          entries.reduce<Record<FluorinationLevel, string>>(
            (accumulator, [level, sdf]) => ({ ...accumulator, [level]: sdf }),
            { F16: '', F40: '', F52: '', F64: '' },
          ),
        )
      } catch {
        if (mounted) {
          setStatus('error')
        }
      }
    }

    void loadModels()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let observer: ResizeObserver | null = null

    const initialize = async () => {
      try {
        const $3Dmol = await import('3dmol')
        if (!mounted || !containerRef.current) {
          return
        }

        const viewer = $3Dmol.createViewer(containerRef.current, {
          antialias: true,
          backgroundColor: 'rgba(0,0,0,0)',
        })
        viewerRef.current = viewer

        observer = new ResizeObserver(() => {
          viewer.resize()
          viewer.render()
        })
        observer.observe(containerRef.current)

        setStatus((current) => (current === 'error' ? current : 'ready'))
      } catch {
        setStatus('error')
      }
    }

    void initialize()

    return () => {
      mounted = false
      observer?.disconnect()
      if (viewerRef.current) {
        viewerRef.current.removeAllModels()
        viewerRef.current.clear()
        viewerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready' || !viewerRef.current) {
      return
    }

    const sdf = modelMap[selectedLevel]
    if (!sdf) {
      return
    }

    const viewer = viewerRef.current
    viewer.removeAllModels()
    viewer.addModel(sdf, 'sdf')
    viewer.setStyle({}, { stick: { radius: 0.15, color: '#c8d7ff' } })
    viewer.setStyle({ elem: 'C' }, { stick: { radius: 0.14, color: '#d7e2ff' } })
    viewer.setStyle({ elem: 'N' }, { stick: { radius: 0.17, color: '#8de8ff' } })
    viewer.setStyle(
      { elem: 'F' },
      {
        sphere: { radius: 0.32, color: '#74ffd1' },
        stick: { radius: 0.11, color: '#74ffd1' },
      },
    )
    viewer.setStyle({ elem: 'Zn' }, { sphere: { radius: 0.62, color: '#86a6ff' } })
    viewer.zoomTo()
    viewer.render()
  }, [modelMap, selectedLevel, status])

  useEffect(() => {
    if (!viewerRef.current || status !== 'ready') {
      return
    }

    viewerRef.current.spin(isSpinning ? 'y' : false, 0.18)
  }, [isSpinning, status])

  const handleSliderChange = (value: string) => {
    const numberValue = Number(value)
    if (Number.isNaN(numberValue)) {
      return
    }
    setSelectedIndex(Math.min(Math.max(numberValue, 0), LEVELS.length - 1))
  }

  return (
    <section id="viewer" className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="spark spark-a" />
      <div className="spark spark-b" />

      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-200/80">DATA-DRIVEN MOLECULAR EXPLORER</p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">FnPcZn Structural Progression (SDF Models)</h2>
          <p className="max-w-3xl text-sm text-slate-200/85 md:text-base">
            Interactive comparison of F16, F40, F52, and F64 zinc phthalocyanines using explicit atom/bond molecular graphs, with
            increasing bulky-group loading reflected by stronger peripheral congestion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSpinning((current) => !current)}
          className="inline-flex items-center justify-center rounded-xl border border-cyan-200/35 bg-slate-900/40 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/65 hover:bg-slate-900/70"
        >
          {isSpinning ? 'Pause Rotation' : 'Resume Rotation'}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-cyan-100/20 bg-slate-950/30">
          <div ref={containerRef} className="h-full w-full" />

          {(status !== 'ready' || !modelMap[selectedLevel]) ? (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/85 text-center">
              <p className="font-mono text-sm text-cyan-100/85">
                {status === 'error'
                  ? 'Model loading failed. Check structure files.'
                  : 'Loading SDF structures...'}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-2xl border border-cyan-100/20 bg-slate-950/55 p-5 backdrop-blur-xl">
          <div className="space-y-3">
            <label htmlFor="fluorination-slider" className="font-mono text-xs tracking-[0.2em] text-cyan-100/80">
              Fluorination Level
            </label>
            <input
              id="fluorination-slider"
              type="range"
              min={0}
              max={LEVELS.length - 1}
              step={1}
              value={selectedIndex}
              onChange={(event) => handleSliderChange(event.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700/70 accent-cyan-300"
            />
            <div className="flex items-center justify-between text-xs text-cyan-100/70">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedIndex(LEVELS.indexOf(level))}
                  className={`rounded-lg px-2 py-1 font-mono transition ${
                    level === selectedLevel
                      ? 'bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-200/45'
                      : 'text-cyan-100/70 hover:bg-slate-800/70 hover:text-cyan-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/55 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/80">{selectedMeta.code}</p>
            <p className="font-mono text-xs text-cyan-100/85">{selectedMeta.formula}</p>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <Atom className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>{selectedMeta.fluorines} fluorine atoms in the molecular formula.</span>
              </li>
              <li className="flex items-start gap-2">
                <Orbit className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>{selectedMeta.crowding}</span>
              </li>
              <li className="flex items-start gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 text-indigo-300" />
                <span>{selectedMeta.aggregation}</span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 text-violet-300" />
                <span>{selectedMeta.source}</span>
              </li>
            </ul>
            <p className="text-sm text-slate-300">{selectedMeta.symmetry}</p>
          </div>

          <p className="text-xs text-slate-400">
            Accuracy note: F16 and F64 are direct PubChem molecular graphs. F40 and F52 are chemistry-consistent derived intermediates
            from the same scaffold because public coordinate deposits for those specific species are access-gated in CCDC/supplemental
            sources.
          </p>
        </aside>
      </div>
    </section>
  )
}
