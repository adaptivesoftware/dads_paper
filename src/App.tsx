import { useEffect } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Beaker,
  BookOpen,
  ExternalLink,
  FlaskConical,
  Microscope,
} from 'lucide-react'
import { AtmosphereBackground } from './components/AtmosphereBackground'
import { DimerReportedChart, MonomerReportedCharts, TrendSynthesisCharts } from './components/ReportedCharts'
import { MolecularViewer } from './components/MolecularViewer'
import { EvidenceRow } from './components/EvidenceRow'
import { FigurePanel } from './components/FigurePanel'
import { paperSections, validateCoverage } from './data/paper_sections'

const DOI_URL = 'https://doi.org/10.1142/S1088424625501093'
const SUPPLEMENT_URL = 'https://www.worldscientific.com/doi/suppl/10.1142/S1088424625501093'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

const sectionMap = paperSections.reduce<
  Record<(typeof paperSections)[number]['id'], (typeof paperSections)[number]>
>(
  (acc, section) => ({ ...acc, [section.id]: section }),
  {} as Record<(typeof paperSections)[number]['id'], (typeof paperSections)[number]>,
)

function App() {
  useEffect(() => {
    const presentIds = paperSections
      .map((section) => section.id)
      .filter((id) => Boolean(document.getElementById(id)))
    const missing = validateCoverage(presentIds)
    if (missing.length) {
      console.warn('Paper coverage mismatch:', missing)
    }
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative px-4 pb-16 pt-6 md:px-8 md:pt-8"
    >
      <AtmosphereBackground />
      <div className="spark spark-c" />

      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="glass-panel h-fit rounded-2xl p-4 lg:sticky lg:top-4">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-100/80">Paper Rail</p>
          <nav className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {paperSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg border border-cyan-100/20 bg-slate-900/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-100/75 transition hover:border-cyan-100/45 hover:text-cyan-100"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <motion.section
            id="intro"
            variants={reveal}
            initial="hidden"
            animate="visible"
            className="glass-panel relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-12"
          >
            <div className="spark spark-a" />
            <div className="spark spark-b" />
            <div className="relative z-10 grid gap-8">
              <div className="space-y-5">
                <p className="font-mono text-xs tracking-[0.28em] text-cyan-200/80">CHAN ET AL. 2025 | JPP 29:1249-1261</p>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  Spectral Properties, Electronic States, and Aggregation of Highly-Fluorinated Zinc Phthalocyanines
                </h1>
                <p className="max-w-4xl text-sm text-slate-100/90 md:text-lg">
                  This SPA maps the paper section-by-section in a narrative flow, covering F<sub>n</sub>PcZn systems where
                  {' 16 <= n <= 64 '}with reported-value charts, source-tagged evidence, and selective imported source figures.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="#viewer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/45 bg-cyan-300/12 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-300/22"
                  >
                    Explore 3D Models
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={DOI_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200/35 bg-slate-900/45 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:border-indigo-200/70 hover:bg-slate-900/75"
                  >
                    Read Original Paper
                    <BookOpen className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                  <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Why Fluorination Matters</p>
                  <p className="mt-3 text-sm text-slate-100/90">
                    The paper frames fluorinated phthalocyanines as electron-deficient, redox-stable tetrapyrroles with no C-H bonds,
                    where progressive inclusion of F and iso-C3F7 groups tunes orbital energies while increasing steric shielding.
                  </p>
                </article>
                <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                  <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Gouterman Primer</p>
                  <p className="mt-3 text-sm text-slate-100/90">
                    Interpretation follows HOMO-1/HOMO/LUMO/LUMO+1 logic, with substitution-driven HOMO/HOMO-1 reordering affecting
                    Q-band intensity and symmetry-sensitive splitting seen in MCD and TD-DFT state assignments.
                  </p>
                </article>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <FigurePanel
                  src="/figures/paper/fig1a.png"
                  figureId="Fig. 1a"
                  caption="Porphyrin-side Gouterman orbital framework from the source paper."
                />
                <FigurePanel
                  src="/figures/paper/fig1b.png"
                  figureId="Fig. 1b"
                  caption="Tetraazaporphyrin/phthalocyanine-side orbital framework with HOMO/HOMO-1 context."
                />
              </div>

              <EvidenceRow refs={sectionMap.intro.evidenceRefs} />
            </div>
          </motion.section>

          <motion.section
            id="methods"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Methods (Experimental and Computational)</h2>
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                <div className="flex items-center gap-2 text-cyan-100">
                  <FlaskConical className="h-4 w-4" />
                  <p className="font-mono text-xs tracking-[0.2em]">Synthesis</p>
                </div>
                <p className="mt-3 text-sm text-slate-200/90">
                  F40/F52/F64 species follow previously reported synthesis routes; H16 and F16 are commercially available benchmarks.
                </p>
              </article>
              <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Microscope className="h-4 w-4" />
                  <p className="font-mono text-xs tracking-[0.2em]">Spectroscopy</p>
                </div>
                <p className="mt-3 text-sm text-slate-200/90">
                  DMF absorption (Cary 50), MCD (Jasco J-810 + 1.4 T magnet), and 25 °C emission/excitation (PTI Quanta Master) were
                  collected from the same samples.
                </p>
              </article>
              <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Beaker className="h-4 w-4" />
                  <p className="font-mono text-xs tracking-[0.2em]">Computation</p>
                </div>
                <p className="mt-3 text-sm text-slate-200/90">
                  Scigress MM/MD pre-optimization followed by Gaussian 16 CAM-B3LYP/6-31G(d,p) GO and TD-DFT (100 states) with
                  PCM solvent handling and GaussView spectral broadening.
                </p>
              </article>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
              <p className="font-mono text-xs tracking-[0.18em] text-cyan-100/80">Computation pipeline</p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  'MM/MD scaffold setup',
                  'DFT geometry optimization',
                  'MO frontier extraction',
                  'TD-DFT state assignment',
                ].map((step, index) => (
                  <div key={step} className="rounded-xl border border-cyan-100/15 bg-slate-900/65 p-3 text-sm text-slate-200">
                    <p className="font-mono text-xs text-cyan-100/80">Step {index + 1}</p>
                    <p className="mt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <EvidenceRow refs={sectionMap.methods.evidenceRefs} />
          </motion.section>

          <motion.section
            id="monomers"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="space-y-5"
          >
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Monomeric Species and Reported Spectral Data</h2>
              <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
                Numeric charts below use Table 1 values only (Q00 centers, Q-1/Q+1 energies, oscillator strengths). Full spectral traces
                are shown as imported source figures when tabulated point-by-point values are not reported.
              </p>
              <div className="mt-5">
                <MonomerReportedCharts />
              </div>
              <div className="mt-5">
                <FigurePanel
                  src="/figures/paper/fig2.png"
                  figureId="Fig. 2"
                  caption="Composite monomer panel from the source paper (MCD, absorbance, emission/excitation, TD-DFT overlays)."
                />
              </div>
              <EvidenceRow refs={sectionMap.monomers.evidenceRefs} />
            </div>

            <MolecularViewer />
          </motion.section>

          <motion.section
            id="structure"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Structure and Symmetry</h2>
            <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
              The paper links substitution pattern to symmetry reduction: near D4h references (H16/F16/F64) versus C2v-like motifs
              for F40/F52, with steric orientation of bulky groups controlling access to pi-stacking faces.
            </p>
            <div className="mt-5">
              <FigurePanel
                src="/figures/paper/fig3.png"
                figureId="Fig. 3"
                caption="Solid-state structures and front/side views used as the structural basis for dimer interpretation."
              />
            </div>
            <EvidenceRow refs={sectionMap.structure.evidenceRefs} />
          </motion.section>

          <motion.section
            id="aggregation"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Aggregation Behavior</h2>
            <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
              F16/F40 exhibit stronger dimer participation, while F52/F64 are more monomeric under reported conditions; chloroform
              favors monomers and ethanol increases aggregation.
            </p>
            <div className="mt-5">
              <FigurePanel
                src="/figures/paper/fig4.png"
                figureId="Fig. 4"
                caption="Concentration and solvent-dependent monomer/dimer analysis from observed and TD-DFT-supported spectra."
              />
            </div>
            <EvidenceRow refs={sectionMap.aggregation.evidenceRefs} />
          </motion.section>

          <motion.section
            id="orbitals"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Orbital and Transition Analysis</h2>
            <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
              The reported MO series shows fluorination-sensitive HOMO/HOMO-1 placement and small but systematic shifts in frontier
              metrics that explain Q-band intensity behavior and low-symmetry splitting.
            </p>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <FigurePanel
                src="/figures/paper/fig5.png"
                figureId="Fig. 5"
                caption="Monomer frontier orbitals and transition assignments for F16M/F40M/F52M/F64M."
              />
              <FigurePanel
                src="/figures/paper/fig6.png"
                figureId="Fig. 6"
                caption="MO energy ladders and reported Delta HOMO / HOMO-LUMO values used in trend reconstructions."
              />
            </div>
            <EvidenceRow refs={sectionMap.orbitals.evidenceRefs} />
          </motion.section>

          <motion.section
            id="dimers"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Dimeric Species</h2>
            <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
              Table 2 is rebuilt as a state-energy/oscillator map for F16D and F40D. These values capture the dimer-induced manifold
              splitting used to interpret mixed monomer-dimer spectra.
            </p>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
              <DimerReportedChart />
              <FigurePanel
                src="/figures/paper/fig7.png"
                figureId="Fig. 7"
                caption="Calculated dimer orbitals and transition pathways for F16D and F40D from the source paper."
              />
            </div>
            <EvidenceRow refs={sectionMap.dimers.evidenceRefs} />
          </motion.section>

          <motion.section
            id="trends"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Trend Synthesis</h2>
            <p className="mt-3 max-w-4xl text-sm text-slate-200/90 md:text-base">
              Fig. 8-style panels are rebuilt from numeric entries in this paper only: Table 1, Fig. 6 bottom metrics, and direct
              wavelength-to-energy conversion for observed Q-band centers.
            </p>
            <div className="mt-5">
              <TrendSynthesisCharts />
            </div>
            <EvidenceRow refs={sectionMap.trends.evidenceRefs} />
          </motion.section>

          <motion.section
            id="conclusions"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Conclusions and Design Implications</h2>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <ul className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5 text-sm text-slate-200/90">
                <li>Fluorination increases Q-band oscillator strength relative to nonfluorinated H16 reference behavior.</li>
                <li>HOMO and LUMO descend together, so HOMO-LUMO gaps remain comparatively stable across the Fn series.</li>
                <li>Symmetry-lowering in nonsymmetric species reproduces observed Q-band splitting trends with small error.</li>
                <li>Dimer-state calculations reproduce splitting behavior and support mixed-state spectral interpretation.</li>
              </ul>
              <div className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5 text-sm text-slate-200/90">
                <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Application Lens</p>
                <p className="mt-3">
                  The paper’s trends support durable photosensitizer and catalytic platform design, including water sterilization,
                  bioinspired sensing, PDT, thiol-coupling chemistry, thin-film/coating systems, and oxygen activation chemistry.
                </p>
              </div>
            </div>
            <EvidenceRow refs={sectionMap.conclusions.evidenceRefs} />
          </motion.section>

          <motion.section
            id="supporting"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Supporting Information and Provenance</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Supplementary Material</p>
                <a
                  href={SUPPLEMENT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200 underline decoration-cyan-300/50 underline-offset-2"
                >
                  Open DOI supplement
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-3 text-sm text-slate-200/90">
                  Includes additional TD-DFT stick-spectrum representation (Fig. S1) and supporting notes.
                </p>
              </article>

              <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
                <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Crystallographic Data</p>
                <p className="mt-3 text-sm text-slate-200/90">
                  Reported CCDC IDs: <span className="font-mono">2493345</span> and <span className="font-mono">2480410</span>
                  (access via CCDC structures portal).
                </p>
                <a
                  href="https://www.ccdc.cam.ac.uk/structures/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200 underline decoration-cyan-300/50 underline-offset-2"
                >
                  Open CCDC structures portal
                  <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p className="font-mono text-xs tracking-[0.18em] text-cyan-100/80">Provenance notes</p>
              <p className="mt-2">
                Direct model sources are tagged in the molecular viewer. Where public coordinate files are not openly deposited,
                derived structures are clearly labeled and used as chemistry-consistent visual surrogates.
              </p>
            </div>

            <EvidenceRow refs={sectionMap.supporting.evidenceRefs} />
          </motion.section>

          <footer className="rounded-2xl border border-cyan-100/15 bg-slate-950/50 px-5 py-4 text-sm text-slate-300/90">
            Citation: Chan D, Zhang A, Wong DL, Mercier D, Pelmus M, Patel HH, Gorun SM, Stillman MJ.{' '}
            <span className="italic">J. Porphyrins Phthalocyanines</span> (2025) 29:1249-1261. DOI:{' '}
            <a className="text-cyan-200 underline decoration-cyan-400/50 underline-offset-2" href={DOI_URL} target="_blank" rel="noreferrer">
              10.1142/S1088424625501093
            </a>
          </footer>
        </div>
      </div>
    </motion.main>
  )
}

export default App
