import type { EvidenceRef } from './paper_sections'

export type MoleculeEntry = {
  id: string
  label: string
  category: 'monomer' | 'dimer' | 'reference'
  provenance: 'direct' | 'derived'
  file: string
  formula: string
  summary: string
  source: string
  evidenceRefs: EvidenceRef[]
}

export const moleculeEntries: MoleculeEntry[] = [
  {
    id: 'H16',
    label: 'H16 (ZnPc reference)',
    category: 'reference',
    provenance: 'direct',
    file: '/structures/H16.sdf',
    formula: 'C32H16N8Zn',
    summary: 'Nonfluorinated baseline used for frontier-orbital and oscillator comparisons.',
    source: 'PubChem CID 114933 (SDF molecular graph).',
    evidenceRefs: [
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 3(a)' },
    ],
  },
  {
    id: 'F16',
    label: 'F16 monomer',
    category: 'monomer',
    provenance: 'direct',
    file: '/structures/F16.sdf',
    formula: 'C32F16N8Zn',
    summary: 'Lower fluorination benchmark with stronger reported dimer contribution.',
    source: 'PubChem CID 11377956 (SDF molecular graph).',
    evidenceRefs: [
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 2 (F16M)' },
    ],
  },
  {
    id: 'F40',
    label: 'F40 monomer',
    category: 'monomer',
    provenance: 'derived',
    file: '/structures/F40.sdf',
    formula: 'C44F40N8Zn',
    summary: 'Intermediate fluorination with C2v-like asymmetry and broadened Q behavior.',
    source: 'Derived from F64 scaffold by removing two bulky peripheral groups and restoring aromatic F.',
    evidenceRefs: [
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 2 (F40M)' },
      { kind: 'figure', id: 'Fig. 3(c)' },
    ],
  },
  {
    id: 'F52',
    label: 'F52 monomer',
    category: 'monomer',
    provenance: 'derived',
    file: '/structures/F52.sdf',
    formula: 'C50F52N8Zn',
    summary: 'Higher fluorination monomer with strong steric shielding and reduced dimer tendency.',
    source: 'Derived from F64 scaffold by removing one bulky peripheral group and restoring aromatic F.',
    evidenceRefs: [
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 2 (F52M)' },
      { kind: 'figure', id: 'Fig. 3(d)' },
    ],
  },
  {
    id: 'F64',
    label: 'F64 monomer',
    category: 'monomer',
    provenance: 'direct',
    file: '/structures/F64.sdf',
    formula: 'C56F64N8Zn',
    summary: 'Maximally fluorinated monomer with strongest steric crowding and monomer preference.',
    source: 'PubChem CID 9964044 (SDF molecular graph).',
    evidenceRefs: [
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 2 (F64M)' },
    ],
  },
  {
    id: 'F16D',
    label: 'F16 dimer',
    category: 'dimer',
    provenance: 'derived',
    file: '/structures/F16_dimer.sdf',
    formula: '(C32F16N8Zn)2',
    summary: 'Stacked dimer representation used for Q-band splitting interpretation in Table 2.',
    source: 'Derived visual assembly from two F16 monomers to mirror reported H-dimer stacking motif.',
    evidenceRefs: [
      { kind: 'table', id: 'Table 2' },
      { kind: 'figure', id: 'Fig. 7 (F16D)' },
    ],
  },
  {
    id: 'F40D',
    label: 'F40 dimer',
    category: 'dimer',
    provenance: 'derived',
    file: '/structures/F40_dimer.sdf',
    formula: '(C44F40N8Zn)2',
    summary: 'Asymmetric stacked dimer representation matching reported F40 dimer analysis.',
    source: 'Derived visual assembly from two F40 monomers to match reported dimer-state analysis.',
    evidenceRefs: [
      { kind: 'table', id: 'Table 2' },
      { kind: 'figure', id: 'Fig. 7 (F40D)' },
    ],
  },
]

export const moleculeModes = [
  { id: 'monomer', label: 'Monomers' },
  { id: 'dimer', label: 'Dimers' },
  { id: 'reference', label: 'Reference' },
] as const
