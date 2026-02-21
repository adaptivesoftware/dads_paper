import type { CompoundId, ReportedDatum } from './types'

const datum = (
  value: number,
  unit: string,
  compound: CompoundId,
  paper_ref: string,
): ReportedDatum => ({
  value,
  unit,
  compound,
  paper_ref,
  quality: 'reported',
})

export type MCDSpanRow = {
  compound: Extract<CompoundId, 'F16' | 'F40' | 'F52' | 'F64'>
  experimentalSpanNm: ReportedDatum
  theoreticalSpanNm: ReportedDatum
  experimentalTripletNm: [ReportedDatum, ReportedDatum, ReportedDatum]
  theoreticalPairNm: [ReportedDatum, ReportedDatum]
  note?: string
}

export const mcdSpanRows: MCDSpanRow[] = [
  {
    compound: 'F16',
    experimentalSpanNm: datum(14, 'nm', 'F16', 'Results and Discussion, p. 1258-1259'),
    theoreticalSpanNm: datum(0, 'nm', 'F16', 'Results and Discussion, p. 1258-1259'),
    experimentalTripletNm: [
      datum(682, 'nm', 'F16', 'Results and Discussion, p. 1258'),
      datum(675, 'nm', 'F16', 'Results and Discussion, p. 1258'),
      datum(668, 'nm', 'F16', 'Results and Discussion, p. 1258'),
    ],
    theoreticalPairNm: [
      datum(632, 'nm', 'F16', 'Results and Discussion, p. 1258'),
      datum(632, 'nm', 'F16', 'Results and Discussion, p. 1258'),
    ],
  },
  {
    compound: 'F40',
    experimentalSpanNm: datum(24, 'nm', 'F40', 'Results and Discussion, p. 1259'),
    theoreticalSpanNm: datum(18, 'nm', 'F40', 'Results and Discussion, p. 1259'),
    experimentalTripletNm: [
      datum(692, 'nm', 'F40', 'Results and Discussion, p. 1259'),
      datum(680, 'nm', 'F40', 'Results and Discussion, p. 1259'),
      datum(668, 'nm', 'F40', 'Results and Discussion, p. 1259'),
    ],
    theoreticalPairNm: [
      datum(635, 'nm', 'F40', 'Results and Discussion, p. 1259'),
      datum(617, 'nm', 'F40', 'Results and Discussion, p. 1259'),
    ],
  },
  {
    compound: 'F52',
    experimentalSpanNm: datum(22, 'nm', 'F52', 'Results and Discussion, p. 1259'),
    theoreticalSpanNm: datum(31, 'nm', 'F52', 'Results and Discussion, p. 1259'),
    experimentalTripletNm: [
      datum(699, 'nm', 'F52', 'Results and Discussion, p. 1259'),
      datum(686, 'nm', 'F52', 'Results and Discussion, p. 1259'),
      datum(677, 'nm', 'F52', 'Results and Discussion, p. 1259'),
    ],
    theoreticalPairNm: [
      datum(647, 'nm', 'F52', 'Results and Discussion, p. 1259'),
      datum(617, 'nm', 'F52', 'Results and Discussion, p. 1259'),
    ],
    note: 'Earlier text also discusses 29 nm using absorption maxima due to dimer overlap.',
  },
  {
    compound: 'F64',
    experimentalSpanNm: datum(14, 'nm', 'F64', 'Results and Discussion, p. 1259'),
    theoreticalSpanNm: datum(0, 'nm', 'F64', 'Results and Discussion, p. 1259'),
    experimentalTripletNm: [
      datum(698, 'nm', 'F64', 'Results and Discussion, p. 1259'),
      datum(691, 'nm', 'F64', 'Results and Discussion, p. 1259'),
      datum(684, 'nm', 'F64', 'Results and Discussion, p. 1259'),
    ],
    theoreticalPairNm: [
      datum(636, 'nm', 'F64', 'Results and Discussion, p. 1259'),
      datum(636, 'nm', 'F64', 'Results and Discussion, p. 1259'),
    ],
  },
]

export type FrontierMetricRow = {
  compound: Extract<CompoundId, 'F16' | 'F40' | 'F52' | 'F64'>
  deltaHomoEv: ReportedDatum
  homoLumoEv: ReportedDatum
}

export const frontierMetricRows: FrontierMetricRow[] = [
  {
    compound: 'F16',
    deltaHomoEv: datum(2.392, 'eV', 'F16', 'Fig. 6 (bottom panel)'),
    homoLumoEv: datum(3.683, 'eV', 'F16', 'Fig. 6 (bottom panel)'),
  },
  {
    compound: 'F40',
    deltaHomoEv: datum(2.278, 'eV', 'F40', 'Fig. 6 (bottom panel)'),
    homoLumoEv: datum(3.702, 'eV', 'F40', 'Fig. 6 (bottom panel)'),
  },
  {
    compound: 'F52',
    deltaHomoEv: datum(2.248, 'eV', 'F52', 'Fig. 6 (bottom panel)'),
    homoLumoEv: datum(3.645, 'eV', 'F52', 'Fig. 6 (bottom panel)'),
  },
  {
    compound: 'F64',
    deltaHomoEv: datum(2.267, 'eV', 'F64', 'Fig. 6 (bottom panel)'),
    homoLumoEv: datum(3.692, 'eV', 'F64', 'Fig. 6 (bottom panel)'),
  },
]

export const qBandEnergyFromNm = (wavelengthNm: number) => {
  return Number((10000 / wavelengthNm).toFixed(3))
}
