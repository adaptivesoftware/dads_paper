import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Orbit, Sigma } from 'lucide-react'
import { monomerQBandCenters, spectraData, type SpectrumPoint } from '../data/spectra'

function SpectraTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: number
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-cyan-100/25 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
      <p className="font-mono text-xs text-cyan-100/90">{label} nm</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mt-1 text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(3)} a.u.
        </p>
      ))}
    </div>
  )
}

export function SpectralChart() {
  return (
    <section className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="spark spark-b" />
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.24em] text-cyan-200/80">UV-VIS ABSORPTION COMPARISON</p>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">F16 vs F64 Spectral Signatures</h2>
        <p className="max-w-4xl text-sm text-slate-200/90 md:text-base">
          Interactive comparison of representative spectra emphasizing the B-band (Soret) near 350 nm and the Q-band region near
          680 nm. The chart reflects the paper’s reported trend that stronger fluorination increases Q-band oscillator strength.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-cyan-100/20 bg-slate-950/45 p-4 md:p-6">
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spectraData} margin={{ top: 20, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis
                  dataKey="wavelength"
                  tick={{ fill: '#c6defd', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                  label={{
                    value: 'Wavelength (nm)',
                    position: 'insideBottom',
                    offset: -4,
                    fill: '#9cc7ff',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                <YAxis
                  tick={{ fill: '#c6defd', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                  label={{
                    value: 'Relative Absorbance (a.u.)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 6,
                    fill: '#9cc7ff',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                />

                <ReferenceArea x1={320} x2={420} fill="rgba(52, 252, 181, 0.12)" stroke="rgba(52, 252, 181, 0.3)" strokeWidth={1} />
                <ReferenceArea x1={640} x2={730} fill="rgba(103, 245, 255, 0.11)" stroke="rgba(103, 245, 255, 0.3)" strokeWidth={1} />

                <ReferenceLine
                  x={350}
                  stroke="rgba(52, 252, 181, 0.55)"
                  strokeDasharray="4 4"
                  label={{ value: 'B-BAND', fill: '#98f7d5', position: 'insideTopLeft', fontSize: 11 }}
                />
                <ReferenceLine
                  x={680}
                  stroke="rgba(103, 245, 255, 0.6)"
                  strokeDasharray="4 4"
                  label={{ value: 'Q-BAND', fill: '#9ce8ff', position: 'insideTopRight', fontSize: 11 }}
                />

                <Tooltip content={<SpectraTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />

                <Line
                  type="monotone"
                  dataKey="f16"
                  name={`F16PcZn (Q00 ${monomerQBandCenters.F16} nm)`}
                  stroke="#8da3ff"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="f64"
                  name={`F64PcZn (Q00 ${monomerQBandCenters.F64} nm)`}
                  stroke="#67f5ff"
                  strokeWidth={2.8}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Curves are smooth reconstructions aligned to reported band centers and trends from the Chan et al. dataset.
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border border-cyan-100/20 bg-slate-950/55 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white">Gouterman 4-Orbital Model</h3>
          <p className="text-sm text-slate-200/90">
            For metallophthalocyanines, the Q/B envelope can be interpreted through transitions among HOMO-1, HOMO, LUMO, and
            LUMO+1. Increasing fluorination lowers frontier orbital energies and shifts transition probabilities.
          </p>

          <ul className="space-y-3 text-sm text-slate-200/90">
            <li className="flex gap-2">
              <Orbit className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <span>
                Fluorine withdrawal increases separation between <span className="font-mono">HOMO</span> and
                <span className="font-mono"> HOMO-1</span> character in the Q manifold.
              </span>
            </li>
            <li className="flex gap-2">
              <Sigma className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>
                Reduced HOMO-1 participation strengthens Q-band oscillator intensity relative to lightly fluorinated analogs.
              </span>
            </li>
            <li className="flex gap-2">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
              <span>
                Reported monomer Q00 peaks: F16 677 nm, F40 692 nm, F52 700 nm, F64 688 nm.
              </span>
            </li>
          </ul>

          <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4 font-mono text-xs text-cyan-100/85">
            Orbital Frame: HOMO-1 → HOMO → LUMO → LUMO+1
            <br />
            Spectral Windows: B-band ~300-400 nm | Q-band ~650-710 nm
          </div>
        </aside>
      </div>
    </section>
  )
}

export type { SpectrumPoint }
