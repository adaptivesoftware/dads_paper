export type CompoundId = 'H16' | 'F16' | 'F40' | 'F52' | 'F64' | 'F16D' | 'F40D'

export type ReportedDatum = {
  value: number
  unit: string
  compound: CompoundId
  paper_ref: string
  quality: 'reported'
}

export type MonomerState = 'S1' | 'S2'
