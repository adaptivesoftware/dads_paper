export type EvidenceRef = {
  kind: 'section' | 'figure' | 'table' | 'supplement'
  id: string
  note?: string
}

export type PaperSectionConfig = {
  id:
    | 'intro'
    | 'methods'
    | 'monomers'
    | 'structure'
    | 'aggregation'
    | 'orbitals'
    | 'dimers'
    | 'trends'
    | 'conclusions'
    | 'supporting'
  title: string
  summary: string
  evidenceRefs: EvidenceRef[]
  componentKey: string
}

export const paperSections: PaperSectionConfig[] = [
  {
    id: 'intro',
    title: 'Intro',
    summary: 'Fluorination motivation, Gouterman context, and application framing.',
    componentKey: 'intro',
    evidenceRefs: [
      { kind: 'section', id: 'Introduction' },
      { kind: 'figure', id: 'Fig. 1' },
    ],
  },
  {
    id: 'methods',
    title: 'Methods',
    summary: 'Synthesis, spectroscopy, and TD-DFT computational pipeline.',
    componentKey: 'methods',
    evidenceRefs: [
      { kind: 'section', id: 'Experimental' },
      { kind: 'section', id: 'Synthesis' },
      { kind: 'section', id: 'Spectroscopy' },
      { kind: 'section', id: 'Computation methods' },
    ],
  },
  {
    id: 'monomers',
    title: 'Monomers',
    summary: 'Monomer spectra, Q band centers, and oscillator trends across fluorination.',
    componentKey: 'monomers',
    evidenceRefs: [
      { kind: 'section', id: 'Results and Discussion: The monomeric species' },
      { kind: 'figure', id: 'Fig. 2' },
      { kind: 'table', id: 'Table 1' },
    ],
  },
  {
    id: 'structure',
    title: 'Structure',
    summary: 'Solid-state structures and symmetry reduction from D4h to C2v-like cases.',
    componentKey: 'structure',
    evidenceRefs: [
      { kind: 'figure', id: 'Fig. 3' },
      { kind: 'section', id: 'Results and Discussion: The monomeric species' },
    ],
  },
  {
    id: 'aggregation',
    title: 'Aggregation',
    summary: 'Monomer-dimer solvent behavior and concentration trends.',
    componentKey: 'aggregation',
    evidenceRefs: [
      { kind: 'figure', id: 'Fig. 4' },
      { kind: 'section', id: 'Results and Discussion: Aggregation analysis' },
    ],
  },
  {
    id: 'orbitals',
    title: 'Orbitals',
    summary: 'MO ordering, transition assignments, and MCD-based splitting interpretation.',
    componentKey: 'orbitals',
    evidenceRefs: [
      { kind: 'figure', id: 'Fig. 5' },
      { kind: 'figure', id: 'Fig. 6' },
      { kind: 'table', id: 'Table 1' },
    ],
  },
  {
    id: 'dimers',
    title: 'Dimers',
    summary: 'F16D and F40D excited-state manifolds and Q band splitting.',
    componentKey: 'dimers',
    evidenceRefs: [
      { kind: 'section', id: 'Results and Discussion: The dimeric species' },
      { kind: 'figure', id: 'Fig. 7' },
      { kind: 'table', id: 'Table 2' },
    ],
  },
  {
    id: 'trends',
    title: 'Trends',
    summary: 'Correlation synthesis linking oscillator strengths, orbital gaps, and Q energies.',
    componentKey: 'trends',
    evidenceRefs: [
      { kind: 'figure', id: 'Fig. 8' },
      { kind: 'table', id: 'Table 1' },
      { kind: 'figure', id: 'Fig. 6 (bottom values)' },
    ],
  },
  {
    id: 'conclusions',
    title: 'Conclusions',
    summary: 'Paper conclusions translated into design implications.',
    componentKey: 'conclusions',
    evidenceRefs: [{ kind: 'section', id: 'Conclusions' }],
  },
  {
    id: 'supporting',
    title: 'Supporting',
    summary: 'Supplement link, CCDC accessions, and provenance notes.',
    componentKey: 'supporting',
    evidenceRefs: [
      { kind: 'supplement', id: 'DOI Supplement' },
      { kind: 'supplement', id: 'CCDC-2493345' },
      { kind: 'supplement', id: 'CCDC-2480410' },
    ],
  },
]

export const validateCoverage = (renderedIds: string[]) => {
  const target = new Set(paperSections.map((section) => section.id))
  return [...target].filter((id) => !renderedIds.includes(id))
}
