import { useEffect, useMemo, useRef, useState } from 'react'
import type { GLViewer } from '3dmol'
import { Atom, Database, FlaskConical, Orbit } from 'lucide-react'
import { moleculeEntries, moleculeModes } from '../data/molecules'
import { EvidenceRow } from './EvidenceRow'

export function MolecularViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<GLViewer | null>(null)

  const [mode, setMode] = useState<(typeof moleculeModes)[number]['id']>('monomer')
  const [selectedId, setSelectedId] = useState('F16')
  const [isSpinning, setIsSpinning] = useState(true)
  const [status, setStatus] = useState<'booting' | 'ready' | 'error'>('booting')
  const [modelMap, setModelMap] = useState<Record<string, string>>({})

  const modeEntries = useMemo(() => {
    if (mode === 'reference') {
      return moleculeEntries.filter((entry) => entry.id === 'H16' || entry.id === 'F16' || entry.id === 'F64')
    }
    return moleculeEntries.filter((entry) => entry.category === mode)
  }, [mode])

  const selectedEntry =
    modeEntries.find((entry) => entry.id === selectedId) ??
    modeEntries[0] ??
    moleculeEntries[0]!

  useEffect(() => {
    if (!modeEntries.length) {
      return
    }
    if (!modeEntries.some((entry) => entry.id === selectedId)) {
      setSelectedId(modeEntries[0].id)
    }
  }, [modeEntries, selectedId])

  useEffect(() => {
    if (!selectedEntry || modelMap[selectedEntry.id]) {
      return
    }
    let mounted = true

    const loadModel = async () => {
      try {
        const response = await fetch(selectedEntry.file)
        if (!response.ok) {
          throw new Error(`Failed to load ${selectedEntry.file}`)
        }
        const sdf = await response.text()
        if (!mounted) {
          return
        }
        setModelMap((current) => ({ ...current, [selectedEntry.id]: sdf }))
      } catch {
        if (mounted) {
          setStatus('error')
        }
      }
    }
    void loadModel()
    return () => {
      mounted = false
    }
  }, [selectedEntry, modelMap])

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

        setStatus('ready')
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
    if (status !== 'ready' || !viewerRef.current || !selectedEntry) {
      return
    }

    const sdf = modelMap[selectedEntry.id]
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
    viewer.setStyle({ elem: 'H' }, { sphere: { radius: 0.2, color: '#f8f7fc' }, stick: { radius: 0.06, color: '#f8f7fc' } })
    viewer.zoomTo()
    viewer.render()
  }, [modelMap, selectedEntry, status])

  useEffect(() => {
    if (!viewerRef.current || status !== 'ready') {
      return
    }

    viewerRef.current.spin(isSpinning ? 'y' : false, 0.18)
  }, [isSpinning, status])

  return (
    <section id="viewer" className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="spark spark-a" />
      <div className="spark spark-b" />

      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-200/80">DATA-DRIVEN MOLECULAR EXPLORER</p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">FnPcZn Molecular Suite (Monomer / Dimer / Reference)</h2>
          <p className="max-w-3xl text-sm text-slate-200/85 md:text-base">
            Dataset-driven viewer for the full paper scope: monomers (F16/F40/F52/F64), dimers (F16D/F40D), and the H16 reference.
            Provenance badges distinguish direct public structures from derived assemblies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {moleculeModes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold tracking-[0.08em] transition ${
                mode === item.id
                  ? 'border border-cyan-100/70 bg-cyan-300/18 text-cyan-100'
                  : 'border border-cyan-100/25 bg-slate-900/40 text-cyan-100/80 hover:border-cyan-100/50 hover:text-cyan-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsSpinning((current) => !current)}
            className="inline-flex items-center justify-center rounded-xl border border-cyan-200/35 bg-slate-900/40 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/65 hover:bg-slate-900/70"
          >
            {isSpinning ? 'Pause Rotation' : 'Resume Rotation'}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-cyan-100/20 bg-slate-950/30">
          <div ref={containerRef} className="h-full w-full" />

          {(status !== 'ready' || !modelMap[selectedEntry.id]) ? (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/85 text-center">
              <p className="font-mono text-sm text-cyan-100/85">
                {status === 'error'
                  ? 'Model loading failed. Check structure files.'
                  : 'Loading selected structure...'}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-2xl border border-cyan-100/20 bg-slate-950/55 p-5 backdrop-blur-xl">
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-[0.2em] text-cyan-100/80">Model Selector</p>
            <div className="grid grid-cols-2 gap-2">
              {modeEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={`rounded-lg px-2 py-1.5 text-left text-xs font-mono transition ${
                    entry.id === selectedEntry.id
                      ? 'bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-200/45'
                      : 'bg-slate-900/40 text-cyan-100/75 hover:bg-slate-800/70 hover:text-cyan-100'
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/55 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/80">{selectedEntry.label}</p>
              <span
                className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  selectedEntry.provenance === 'direct'
                    ? 'border border-emerald-200/35 bg-emerald-300/10 text-emerald-100'
                    : 'border border-amber-200/35 bg-amber-300/10 text-amber-100'
                }`}
              >
                {selectedEntry.provenance}
              </span>
            </div>
            <p className="font-mono text-xs text-cyan-100/85">{selectedEntry.formula}</p>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <Atom className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>{selectedEntry.summary}</span>
              </li>
              <li className="flex items-start gap-2">
                <Orbit className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>Mode: {mode === 'reference' ? 'Reference comparison set' : mode}</span>
              </li>
              <li className="flex items-start gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 text-indigo-300" />
                <span>File: {selectedEntry.file}</span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 text-violet-300" />
                <span>{selectedEntry.source}</span>
              </li>
            </ul>
            <EvidenceRow refs={selectedEntry.evidenceRefs} />
          </div>

          <p className="text-xs text-slate-400">
            Accuracy note: some models are derived where direct deposited coordinates were unavailable from open sources. Derived models
            are tagged and used only as chemistry-consistent visualization surrogates.
          </p>
        </aside>
      </div>
    </section>
  )
}
