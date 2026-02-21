import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { frontierMetricRows, mcdSpanRows, qBandEnergyFromNm } from '../data/mcd_metrics'
import { table1ByCompound, table1Rows } from '../data/table1'
import { table2Rows } from '../data/table2'
import type { ReportedDatum } from '../data/types'

const axisStyle = { fill: '#c6defd', fontSize: 11, fontFamily: 'var(--font-mono)' }

const assertReported = (datum: ReportedDatum, context: string) => {
  if (datum.quality !== 'reported' || !datum.paper_ref) {
    throw new Error(`Non-reported or unreferenced datum in ${context}`)
  }
}

table1Rows.forEach((row) => {
  assertReported(row.experimentalQBandNm, `${row.compound}-${row.state}-experimentalQBandNm`)
  assertReported(row.stateEnergyNm, `${row.compound}-${row.state}-stateEnergyNm`)
  assertReported(row.oscillatorStrength, `${row.compound}-${row.state}-oscillatorStrength`)
  assertReported(row.dominantContributionPct, `${row.compound}-${row.state}-dominantContributionPct`)
})
table2Rows.forEach((row) => {
  assertReported(row.stateEnergyNm, `${row.compound}-${row.state}-stateEnergyNm`)
  assertReported(row.oscillatorStrength, `${row.compound}-${row.state}-oscillatorStrength`)
})
mcdSpanRows.forEach((row) => {
  assertReported(row.experimentalSpanNm, `${row.compound}-experimentalSpanNm`)
  assertReported(row.theoreticalSpanNm, `${row.compound}-theoreticalSpanNm`)
  row.experimentalTripletNm.forEach((datum, index) => assertReported(datum, `${row.compound}-experimentalTriplet-${index}`))
  row.theoreticalPairNm.forEach((datum, index) => assertReported(datum, `${row.compound}-theoreticalPair-${index}`))
})
frontierMetricRows.forEach((row) => {
  assertReported(row.deltaHomoEv, `${row.compound}-deltaHomoEv`)
  assertReported(row.homoLumoEv, `${row.compound}-homoLumoEv`)
})

function DataBasisBadge({ refs }: { refs: string }) {
  return (
    <p className="inline-flex rounded-full border border-cyan-100/25 bg-slate-900/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100/80">
      Data basis: Reported values only ({refs})
    </p>
  )
}

function TooltipCard({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: Record<string, unknown>; color?: string }>; label?: string }) {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0].payload
  const paperRef = typeof row.paperRef === 'string' ? row.paperRef : ''

  return (
    <div className="rounded-xl border border-cyan-100/25 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
      {label ? <p className="font-mono text-xs text-cyan-100/90">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} className="mt-1 text-xs" style={{ color: entry.color ?? '#b2dbff' }}>
          {entry.name}: {Number(entry.value).toFixed(3)}
        </p>
      ))}
      {paperRef ? <p className="mt-2 font-mono text-[10px] text-slate-300">{paperRef}</p> : null}
    </div>
  )
}

const monomerBandData = table1ByCompound.map((row) => ({
  compound: row.compound,
  observedQ00: row.observedQ00Nm.value,
  calcQCenter: row.calculatedQBandCenterNm.value,
  calcQMinus: row.calculatedQMinusNm.value,
  calcQPlus: row.calculatedQPlusNm.value,
  paperRef: 'Table 1',
}))

const monomerOscillatorData = table1ByCompound.map((row) => ({
  compound: row.compound,
  s1: row.oscillatorS1.value,
  s2: row.oscillatorS2.value,
  paperRef: 'Table 1',
}))

const mcdSpanData = mcdSpanRows.map((row) => ({
  compound: row.compound,
  experimental: row.experimentalSpanNm.value,
  theoretical: row.theoreticalSpanNm.value,
  paperRef: row.experimentalSpanNm.paper_ref,
}))

const dimerStateData = table2Rows.map((row) => ({
  compound: row.compound,
  state: row.state,
  qBandLabel: row.qBandLabel,
  energyNm: row.stateEnergyNm.value,
  oscillator: row.oscillatorStrength.value,
  stateLabel: `${row.compound} ${row.state}`,
  paperRef: row.stateEnergyNm.paper_ref,
}))

const oscillatorTrendData = frontierMetricRows.map((frontier) => {
  const monomer = table1ByCompound.find((row) => row.compound === frontier.compound)
  if (!monomer) {
    throw new Error(`Missing Table 1 row for ${frontier.compound}`)
  }
  return {
    compound: frontier.compound,
    x: frontier.deltaHomoEv.value,
    y: monomer.oscillatorS1.value,
    paperRef: `${frontier.deltaHomoEv.paper_ref}; Table 1`,
  }
})

const observedEnergyTrendData = frontierMetricRows.map((frontier) => {
  const monomer = table1ByCompound.find((row) => row.compound === frontier.compound)
  if (!monomer) {
    throw new Error(`Missing Table 1 row for ${frontier.compound}`)
  }
  return {
    compound: frontier.compound,
    x: frontier.homoLumoEv.value,
    y: qBandEnergyFromNm(monomer.observedQ00Nm.value),
    paperRef: `${frontier.homoLumoEv.paper_ref}; Table 1`,
  }
})

const calculatedVsObservedTrendData = table1ByCompound.map((row) => ({
  compound: row.compound,
  x: row.calculatedQBandCenterNm.value,
  y: row.observedQ00Nm.value,
  paperRef: 'Table 1',
}))

const fnPoints = { fill: '#ff5c8a' }

export function MonomerReportedCharts() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">Q-band Centers: Observed vs Calculated</h3>
          <DataBasisBadge refs="Table 1" />
        </div>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monomerBandData} margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="compound" tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} label={{ value: 'Wavelength (nm)', angle: -90, position: 'insideLeft', fill: '#9cc7ff', fontSize: 11 }} />
              <Tooltip content={<TooltipCard />} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <Line dataKey="observedQ00" name="Observed Q00" stroke="#67f5ff" strokeWidth={2.4} dot={{ r: 4 }} />
              <Line dataKey="calcQCenter" name="Calculated Q center (Q-1/Q+1 mean)" stroke="#8da3ff" strokeWidth={2.2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">Monomer Oscillator Strengths</h3>
          <DataBasisBadge refs="Table 1" />
        </div>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monomerOscillatorData} margin={{ top: 18, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="compound" tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} label={{ value: 'Oscillator strength (f)', angle: -90, position: 'insideLeft', fill: '#9cc7ff', fontSize: 11 }} />
              <Tooltip content={<TooltipCard />} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <Bar dataKey="s1" name="S1 (Q-1)" fill="#34fcb5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="s2" name="S2 (Q+1)" fill="#8da3ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-4 xl:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">MCD Span: Experiment vs Theory</h3>
          <DataBasisBadge refs="Results and Discussion (p. 1258-1259)" />
        </div>
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mcdSpanData} margin={{ top: 18, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="compound" tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} label={{ value: 'Q span (nm)', angle: -90, position: 'insideLeft', fill: '#9cc7ff', fontSize: 11 }} />
              <Tooltip content={<TooltipCard />} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <Bar dataKey="experimental" name="Experimental span" fill="#ff7da6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="theoretical" name="Theoretical span" fill="#67f5ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  )
}

export function DimerReportedChart() {
  return (
    <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Dimer States (Table 2): Energy vs Oscillator</h3>
        <DataBasisBadge refs="Table 2" />
      </div>
      <div className="mt-4 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 22, left: 8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              type="number"
              dataKey="energyNm"
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              label={{ value: 'State Energy (nm)', position: 'insideBottom', offset: -6, fill: '#9cc7ff', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="oscillator"
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              label={{ value: 'Oscillator strength (f)', angle: -90, position: 'insideLeft', fill: '#9cc7ff', fontSize: 11 }}
            />
            <Tooltip cursor={{ strokeDasharray: '4 4' }} content={<TooltipCard />} />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
            <Scatter
              name="F16D states"
              data={dimerStateData.filter((row) => row.compound === 'F16D')}
              fill="#67f5ff"
              shape="diamond"
            />
            <Scatter
              name="F40D states"
              data={dimerStateData.filter((row) => row.compound === 'F40D')}
              fill="#ff7da6"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

function TrendScatter({
  title,
  xLabel,
  yLabel,
  data,
}: {
  title: string
  xLabel: string
  yLabel: string
  data: Array<{ compound: string; x: number; y: number; paperRef: string }>
}) {
  return (
    <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-3 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 16, left: 8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              type="number"
              dataKey="x"
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              label={{ value: xLabel, position: 'insideBottom', offset: -6, fill: '#9cc7ff', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#9cc7ff', fontSize: 11 }}
            />
            <Tooltip cursor={{ strokeDasharray: '4 4' }} content={<TooltipCard />} />
            <Scatter name="FnPcZn" data={data} {...fnPoints} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export function TrendSynthesisCharts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Fig. 8-style Correlations (Fn-only)</h3>
        <DataBasisBadge refs="Table 1 + Fig. 6 bottom" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <TrendScatter
          title="Q Oscillator vs Delta HOMO"
          xLabel="Delta HOMO (eV)"
          yLabel="Q-band oscillator strength"
          data={oscillatorTrendData}
        />
        <TrendScatter
          title="Observed Q Energy vs HOMO-LUMO"
          xLabel="HOMO-LUMO (eV)"
          yLabel="Observed Q energy (10^3 cm^-1)"
          data={observedEnergyTrendData}
        />
        <TrendScatter
          title="Experimental vs Calculated Q band"
          xLabel="Calculated Q band (nm)"
          yLabel="Experimental Q band (nm)"
          data={calculatedVsObservedTrendData}
        />
      </div>
      <p className="text-xs text-slate-400">
        Note: literature points for TPP/NP/TAP/Pc/Nc shown in the paper adaptation are not replotted here because their numeric values are
        not tabulated in this article.
      </p>
    </div>
  )
}
