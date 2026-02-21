import type { CompoundId, ReportedDatum } from './types'

const datum = (
  value: number,
  unit: string,
  compound: CompoundId,
  paper_ref = 'Table 2',
): ReportedDatum => ({
  value,
  unit,
  compound,
  paper_ref,
  quality: 'reported',
})

export type Table2Row = {
  compound: Extract<CompoundId, 'F16D' | 'F40D'>
  state: 'S1' | 'S2' | 'S3' | 'S4' | 'S5'
  qBandLabel: 'Q-1' | 'Q+1' | 'CT'
  stateEnergyNm: ReportedDatum
  oscillatorStrength: ReportedDatum
}

export const table2Rows: Table2Row[] = [
  {
    compound: 'F16D',
    state: 'S1',
    qBandLabel: 'Q-1',
    stateEnergyNm: datum(704, 'nm', 'F16D'),
    oscillatorStrength: datum(0.0077, 'f', 'F16D'),
  },
  {
    compound: 'F16D',
    state: 'S2',
    qBandLabel: 'Q+1',
    stateEnergyNm: datum(657, 'nm', 'F16D'),
    oscillatorStrength: datum(0.0013, 'f', 'F16D'),
  },
  {
    compound: 'F16D',
    state: 'S3',
    qBandLabel: 'Q-1',
    stateEnergyNm: datum(642, 'nm', 'F16D'),
    oscillatorStrength: datum(0.967, 'f', 'F16D'),
  },
  {
    compound: 'F16D',
    state: 'S4',
    qBandLabel: 'Q+1',
    stateEnergyNm: datum(612, 'nm', 'F16D'),
    oscillatorStrength: datum(0.961, 'f', 'F16D'),
  },
  {
    compound: 'F40D',
    state: 'S1',
    qBandLabel: 'Q-1',
    stateEnergyNm: datum(672, 'nm', 'F40D'),
    oscillatorStrength: datum(0.946, 'f', 'F40D'),
  },
  {
    compound: 'F40D',
    state: 'S2',
    qBandLabel: 'Q+1',
    stateEnergyNm: datum(664, 'nm', 'F40D'),
    oscillatorStrength: datum(0.013, 'f', 'F40D'),
  },
  {
    compound: 'F40D',
    state: 'S3',
    qBandLabel: 'CT',
    stateEnergyNm: datum(627, 'nm', 'F40D'),
    oscillatorStrength: datum(1.172, 'f', 'F40D'),
  },
  {
    compound: 'F40D',
    state: 'S4',
    qBandLabel: 'Q-1',
    stateEnergyNm: datum(569, 'nm', 'F40D'),
    oscillatorStrength: datum(0.032, 'f', 'F40D'),
  },
  {
    compound: 'F40D',
    state: 'S5',
    qBandLabel: 'Q+1',
    stateEnergyNm: datum(548, 'nm', 'F40D'),
    oscillatorStrength: datum(0.302, 'f', 'F40D'),
  },
]
