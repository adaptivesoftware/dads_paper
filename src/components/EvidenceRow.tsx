import type { EvidenceRef } from '../data/paper_sections'

const kindLabel: Record<EvidenceRef['kind'], string> = {
  section: 'Section',
  figure: 'Figure',
  table: 'Table',
  supplement: 'Supplement',
}

export function EvidenceRow({ refs }: { refs: EvidenceRef[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
      <span className="font-mono uppercase tracking-[0.18em] text-cyan-100/65">Evidence</span>
      {refs.map((ref) => (
        <span
          key={`${ref.kind}-${ref.id}`}
          className="rounded-lg border border-cyan-100/20 bg-slate-900/65 px-2 py-1 font-mono text-[11px] text-cyan-100/85"
          title={ref.note}
        >
          {kindLabel[ref.kind]}: {ref.id}
        </span>
      ))}
    </div>
  )
}
