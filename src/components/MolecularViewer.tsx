import { useEffect, useMemo, useRef, useState } from 'react'
import type { GLViewer } from '3dmol'
import { Atom, FlaskConical, Orbit } from 'lucide-react'

const LEVELS = ['F16', 'F40', 'F52', 'F64'] as const

export type FluorinationLevel = (typeof LEVELS)[number]

type AtomSpec = {
  elem: 'C' | 'N' | 'F' | 'Zn'
  x: number
  y: number
  z: number
}

type LevelMeta = {
  code: string
  fluorines: number
  substituentGroups: number
  crowding: string
  aggregation: string
  symmetry: string
}

const LEVEL_META: Record<FluorinationLevel, LevelMeta> = {
  F16: {
    code: 'F16PcZn',
    fluorines: 16,
    substituentGroups: 0,
    crowding: 'Low steric crowding around the macrocycle edge.',
    aggregation: 'Higher dimer tendency via face-to-face π-π interactions.',
    symmetry: 'Near D4h-like symmetry in the idealized planar form.',
  },
  F40: {
    code: 'F40PcZn',
    fluorines: 40,
    substituentGroups: 3,
    crowding: 'Bulky substituents begin shielding the aromatic perimeter.',
    aggregation: 'Mixed monomer/dimer behavior with broadened spectral features.',
    symmetry: 'Symmetry lowering trends toward C2v-like distortion.',
  },
  F52: {
    code: 'F52PcZn',
    fluorines: 52,
    substituentGroups: 5,
    crowding: 'Pronounced peripheral crowding from more bulky groups.',
    aggregation: 'Lower dimer fraction than F16/F40 in solution.',
    symmetry: 'Reduced symmetry contributes to Q-band splitting in MCD.',
  },
  F64: {
    code: 'F64PcZn',
    fluorines: 64,
    substituentGroups: 8,
    crowding: 'Maximum crowding with dense fluoroalkyl shielding.',
    aggregation: 'Predominantly monomeric behavior under tested conditions.',
    symmetry: 'Nominally D4h-like scaffold with substantial steric shielding.',
  },
}

const EXTRA_PERIPHERAL_FLUORINES: Record<FluorinationLevel, number> = {
  F16: 0,
  F40: 6,
  F52: 10,
  F64: 16,
}

function addAtom(atoms: AtomSpec[], elem: AtomSpec['elem'], x: number, y: number, z: number) {
  atoms.push({ elem, x, y, z })
}

function buildStylizedPcModel(level: FluorinationLevel) {
  const atoms: AtomSpec[] = []
  const substituentGroups = LEVEL_META[level].substituentGroups
  const extraF = EXTRA_PERIPHERAL_FLUORINES[level]

  addAtom(atoms, 'Zn', 0, 0, 0)

  const macrocycleRadius = 5.4
  const ringCount = 16
  const ringPoints: Array<{ x: number; y: number; z: number; angle: number }> = []

  for (let index = 0; index < ringCount; index += 1) {
    const angle = (Math.PI * 2 * index) / ringCount
    const x = Math.cos(angle) * macrocycleRadius
    const y = Math.sin(angle) * macrocycleRadius
    const z = Math.sin(index * 0.65) * 0.16
    ringPoints.push({ x, y, z, angle })
    addAtom(atoms, 'C', x, y, z)
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = (Math.PI * 2 * index) / 8 + Math.PI / 8
    addAtom(
      atoms,
      'N',
      Math.cos(angle) * 3.45,
      Math.sin(angle) * 3.45,
      Math.sin(index * 0.55) * 0.08,
    )
  }

  for (const point of ringPoints) {
    addAtom(
      atoms,
      'F',
      point.x + Math.cos(point.angle) * 1.4,
      point.y + Math.sin(point.angle) * 1.4,
      point.z + 0.12,
    )
  }

  for (let index = 0; index < extraF; index += 1) {
    const angle = (Math.PI * 2 * index) / extraF + Math.PI / 16
    const radialJitter = index % 2 === 0 ? 0.45 : -0.35
    const z = 0.55 * Math.sin(index * 0.8)
    addAtom(
      atoms,
      'F',
      Math.cos(angle) * (6.6 + radialJitter),
      Math.sin(angle) * (6.6 + radialJitter),
      z,
    )
  }

  const anchorRadius = 7.8
  for (let groupIndex = 0; groupIndex < substituentGroups; groupIndex += 1) {
    const anchorAngle = (Math.PI * 2 * groupIndex) / 8 + Math.PI / 16
    const anchorX = Math.cos(anchorAngle) * anchorRadius
    const anchorY = Math.sin(anchorAngle) * anchorRadius
    const anchorZ = 0.58 * Math.sin(groupIndex * 1.15)

    addAtom(atoms, 'C', anchorX, anchorY, anchorZ)

    for (let arm = 0; arm < 3; arm += 1) {
      const armAngle = anchorAngle + (Math.PI * 2 * arm) / 3 + 0.16
      const radialX = Math.cos(anchorAngle)
      const radialY = Math.sin(anchorAngle)
      const tangentX = -Math.sin(anchorAngle)
      const tangentY = Math.cos(anchorAngle)

      const branchX = anchorX + radialX * 1.26 + Math.cos(armAngle) * 0.42 + tangentX * (arm - 1) * 0.68
      const branchY = anchorY + radialY * 1.26 + Math.sin(armAngle) * 0.42 + tangentY * (arm - 1) * 0.68
      const branchZ = anchorZ + (arm - 1) * 0.52

      addAtom(atoms, 'C', branchX, branchY, branchZ)

      for (let fluorine = 0; fluorine < 3; fluorine += 1) {
        const fluorineAngle = armAngle + (Math.PI * 2 * fluorine) / 3 + 0.25
        const fx = branchX + Math.cos(fluorineAngle) * 0.86 + radialX * 0.22
        const fy = branchY + Math.sin(fluorineAngle) * 0.86 + radialY * 0.22
        const fz = branchZ + (fluorine - 1) * 0.46
        addAtom(atoms, 'F', fx, fy, fz)
      }
    }
  }

  const lines = atoms.map(
    (atom) => `${atom.elem} ${atom.x.toFixed(3)} ${atom.y.toFixed(3)} ${atom.z.toFixed(3)}`,
  )

  return `${atoms.length}\n${LEVEL_META[level].code} stylized geometry\n${lines.join('\n')}`
}

export function MolecularViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<GLViewer | null>(null)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(true)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const selectedLevel = LEVELS[selectedIndex]
  const selectedMeta = LEVEL_META[selectedLevel]

  const modelMap = useMemo(
    () =>
      LEVELS.reduce<Record<FluorinationLevel, string>>(
        (accumulator, level) => ({
          ...accumulator,
          [level]: buildStylizedPcModel(level),
        }),
        { F16: '', F40: '', F52: '', F64: '' },
      ),
    [],
  )

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
    if (status !== 'ready' || !viewerRef.current) {
      return
    }

    const viewer = viewerRef.current
    viewer.removeAllModels()
    viewer.addModel(modelMap[selectedLevel], 'xyz')
    viewer.setStyle({}, { stick: { radius: 0.16, color: '#d9e7ff' } })
    viewer.setStyle({ elem: 'N' }, { stick: { radius: 0.18, color: '#7de7ff' } })
    viewer.setStyle(
      { elem: 'F' },
      { sphere: { radius: 0.33, color: '#79ffd5' }, stick: { radius: 0.11, color: '#79ffd5' } },
    )
    viewer.setStyle({ elem: 'Zn' }, { sphere: { radius: 0.62, color: '#7ea2ff' } })
    viewer.zoomTo()
    viewer.render()
  }, [modelMap, selectedLevel, status])

  useEffect(() => {
    if (!viewerRef.current || status !== 'ready') {
      return
    }

    viewerRef.current.spin(isSpinning ? 'y' : false, 0.2)
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
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-200/80">3DMOL.JS MOLECULAR EXPLORER</p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Interactive Fluorination Progression</h2>
          <p className="max-w-3xl text-sm text-slate-200/85 md:text-base">
            Switch between <span className="font-semibold text-cyan-200">F16</span>,
            <span className="font-semibold text-cyan-200"> F40</span>,
            <span className="font-semibold text-cyan-200"> F52</span>, and
            <span className="font-semibold text-cyan-200"> F64</span> to inspect how bulky fluoroalkyl decoration increases
            steric shielding around the Zn phthalocyanine core.
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-cyan-100/20 bg-slate-950/30">
          <div ref={containerRef} className="h-full w-full" />

          {status !== 'ready' ? (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/85 text-center">
              <p className="font-mono text-sm text-cyan-100/85">
                {status === 'loading' ? 'Initializing molecular viewer...' : 'Viewer failed to initialize in this browser.'}
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
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <Atom className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>{selectedMeta.fluorines} peripheral fluorines represented conceptually.</span>
              </li>
              <li className="flex items-start gap-2">
                <Orbit className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>{selectedMeta.crowding}</span>
              </li>
              <li className="flex items-start gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 text-indigo-300" />
                <span>{selectedMeta.aggregation}</span>
              </li>
            </ul>
            <p className="text-sm text-slate-300">{selectedMeta.symmetry}</p>
          </div>

          <p className="text-xs text-slate-400">
            The viewer uses a stylized geometry scaffold to compare substitution-driven steric effects from the paper’s F16/F40/F52/F64
            series in one consistent frame.
          </p>
        </aside>
      </div>
    </section>
  )
}
