import { ImageIcon } from 'lucide-react'

type FigurePanelProps = {
  src: string
  figureId: string
  caption: string
}

export function FigurePanel({ src, figureId, caption }: FigurePanelProps) {
  return (
    <figure className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-300">
        <span className="font-mono tracking-[0.18em] text-cyan-100/80">{figureId}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-600/70 bg-slate-900/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">
          <ImageIcon className="h-3 w-3" />
          Imported from source PDF
        </span>
      </div>
      <img src={src} alt={caption} loading="lazy" className="w-full rounded-xl border border-slate-700/70 bg-slate-100" />
      <figcaption className="mt-3 text-sm text-slate-300/90">{caption}</figcaption>
    </figure>
  )
}
