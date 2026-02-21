import type { CompoundId, MonomerState, ReportedDatum } from './types'

const datum = (
  value: number,
  unit: string,
  compound: CompoundId,
  paper_ref = 'Table 1',
): ReportedDatum => ({
  value,
  unit,
  compound,
  paper_ref,
  quality: 'reported',
})

export type Table1Row = {
  compound: Extract<CompoundId, 'H16' | 'F16' | 'F40' | 'F52' | 'F64'>
  state: MonomerState
  qBandLabel: 'Q-1' | 'Q+1'
  experimentalQBandNm: ReportedDatum
  stateEnergyNm: ReportedDatum
  oscillatorStrength: ReportedDatum
  dominantTransition: string
  dominantContributionPct: ReportedDatum
}

export const table1Rows: Table1Row[] = [
  {
    compound: 'H16',
    state: 'S1',
    qBandLabel: 'Q-1',
    experimentalQBandNm: datum(670, 'nm', 'H16'),
    stateEnergyNm: datum(623, 'nm', 'H16'),
    oscillatorStrength: datum(0.62, 'f', 'H16'),
    dominantTransition: '147 -> 148',
    dominantContributionPct: datum(73.6, '%', 'H16'),
  },
  {
    compound: 'H16',
    state: 'S2',
    qBandLabel: 'Q+1',
    experimentalQBandNm: datum(670, 'nm', 'H16'),
    stateEnergyNm: datum(623, 'nm', 'H16'),
    oscillatorStrength: datum(0.62, 'f', 'H16'),
    dominantTransition: '147 -> 149',
    dominantContributionPct: datum(73.6, '%', 'H16'),
  },
  {
    compound: 'F16',
    state: 'S1',
    qBandLabel: 'Q-1',
    experimentalQBandNm: datum(677, 'nm', 'F16'),
    stateEnergyNm: datum(632, 'nm', 'F16'),
    oscillatorStrength: datum(0.66, 'f', 'F16'),
    dominantTransition: '211 -> 212',
    dominantContributionPct: datum(94.7, '%', 'F16'),
  },
  {
    compound: 'F16',
    state: 'S2',
    qBandLabel: 'Q+1',
    experimentalQBandNm: datum(677, 'nm', 'F16'),
    stateEnergyNm: datum(632, 'nm', 'F16'),
    oscillatorStrength: datum(0.66, 'f', 'F16'),
    dominantTransition: '211 -> 213',
    dominantContributionPct: datum(94.7, '%', 'F16'),
  },
  {
    compound: 'F40',
    state: 'S1',
    qBandLabel: 'Q-1',
    experimentalQBandNm: datum(692, 'nm', 'F40'),
    stateEnergyNm: datum(635, 'nm', 'F40'),
    oscillatorStrength: datum(0.75, 'f', 'F40'),
    dominantTransition: '355 -> 356',
    dominantContributionPct: datum(94.7, '%', 'F40'),
  },
  {
    compound: 'F40',
    state: 'S2',
    qBandLabel: 'Q+1',
    experimentalQBandNm: datum(692, 'nm', 'F40'),
    stateEnergyNm: datum(617, 'nm', 'F40'),
    oscillatorStrength: datum(0.71, 'f', 'F40'),
    dominantTransition: '355 -> 357',
    dominantContributionPct: datum(94.8, '%', 'F40'),
  },
  {
    compound: 'F52',
    state: 'S1',
    qBandLabel: 'Q-1',
    experimentalQBandNm: datum(700, 'nm', 'F52'),
    stateEnergyNm: datum(647, 'nm', 'F52'),
    oscillatorStrength: datum(0.82, 'f', 'F52'),
    dominantTransition: '427 -> 428',
    dominantContributionPct: datum(94.9, '%', 'F52'),
  },
  {
    compound: 'F52',
    state: 'S2',
    qBandLabel: 'Q+1',
    experimentalQBandNm: datum(700, 'nm', 'F52'),
    stateEnergyNm: datum(617, 'nm', 'F52'),
    oscillatorStrength: datum(0.72, 'f', 'F52'),
    dominantTransition: '427 -> 429',
    dominantContributionPct: datum(94.4, '%', 'F52'),
  },
  {
    compound: 'F64',
    state: 'S1',
    qBandLabel: 'Q-1',
    experimentalQBandNm: datum(688, 'nm', 'F64'),
    stateEnergyNm: datum(636, 'nm', 'F64'),
    oscillatorStrength: datum(0.8, 'f', 'F64'),
    dominantTransition: '499 -> 500',
    dominantContributionPct: datum(92.0, '%', 'F64'),
  },
  {
    compound: 'F64',
    state: 'S2',
    qBandLabel: 'Q+1',
    experimentalQBandNm: datum(688, 'nm', 'F64'),
    stateEnergyNm: datum(636, 'nm', 'F64'),
    oscillatorStrength: datum(0.8, 'f', 'F64'),
    dominantTransition: '499 -> 501',
    dominantContributionPct: datum(92.0, '%', 'F64'),
  },
]

export const fnMonomers: Array<Extract<CompoundId, 'F16' | 'F40' | 'F52' | 'F64'>> = [
  'F16',
  'F40',
  'F52',
  'F64',
]

export const table1ByCompound = fnMonomers.map((compound) => {
  const rows = table1Rows.filter((row) => row.compound === compound)
  const s1 = rows.find((row) => row.state === 'S1')
  const s2 = rows.find((row) => row.state === 'S2')
  if (!s1 || !s2) {
    throw new Error(`Missing S1/S2 entries for ${compound}`)
  }

  return {
    compound,
    observedQ00Nm: s1.experimentalQBandNm,
    calculatedQMinusNm: s1.stateEnergyNm,
    calculatedQPlusNm: s2.stateEnergyNm,
    calculatedQBandCenterNm: datum(
      Number(((s1.stateEnergyNm.value + s2.stateEnergyNm.value) / 2).toFixed(1)),
      'nm',
      compound,
      'Table 1 (Q-1/Q+1 mean)',
    ),
    oscillatorS1: s1.oscillatorStrength,
    oscillatorS2: s2.oscillatorStrength,
  }
})
