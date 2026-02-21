import { motion } from 'motion/react'
import {
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  Droplets,
  Microscope,
  ShieldPlus,
  Sparkles,
  Sprout,
  TestTube,
  Waves,
} from 'lucide-react'
import { AtmosphereBackground } from './components/AtmosphereBackground'
import { MolecularViewer } from './components/MolecularViewer'
import { SpectralChart } from './components/SpectralChart'

const DOI_URL = 'https://doi.org/10.1142/S1088424625501093'

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
    },
  },
}

const applications = [
  {
    title: 'Water Sterilization',
    detail: 'Photocatalytic disinfection pathways driven by robust fluoro-Pc photosensitizers.',
    icon: Droplets,
  },
  {
    title: 'Bioinspired Sensors',
    detail: 'Peroxidase-like behavior enables synthetic substitutes for enzyme-based sensing.',
    icon: Microscope,
  },
  {
    title: 'Photodynamic Therapy',
    detail: 'Strong red-region absorption and singlet oxygen generation support PDT designs.',
    icon: Sparkles,
  },
  {
    title: 'Thiol-Coupling',
    detail: 'Catalytic utility in sulfur-rich coupling chemistry relevant to petroleum systems.',
    icon: TestTube,
  },
  {
    title: 'Thin Films & Coatings',
    detail: 'Thermally stable, fluorinated macrocycles fit durable functional material platforms.',
    icon: ShieldPlus,
  },
  {
    title: 'Oxygen Activation',
    detail: 'Redox-stable, non-toxic alternatives to natural oxygen-activating enzyme classes.',
    icon: Sprout,
  },
]

function App() {
  const scrollToViewer = () => {
    document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="relative px-4 pb-16 pt-6 md:px-8 md:pt-8">
      <AtmosphereBackground />
      <div className="spark spark-c" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 md:gap-14">
        <motion.section
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="glass-panel relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-12"
        >
          <div className="spark spark-a" />
          <div className="spark spark-b" />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <p className="font-mono text-xs tracking-[0.28em] text-cyan-200/80">CHAN ET AL. 2025 | MOLECULAR PHOTOPHYSICS</p>
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Spectral Properties, Electronic States, and Aggregation of Highly-Fluorinated Zinc Phthalocyanines
              </h1>
              <p className="max-w-3xl text-sm text-slate-100/90 md:text-lg">
                A visual deep dive into the <span className="font-semibold text-cyan-100">F<sub>n</sub>PcZn</span> series
                (<span className="font-semibold text-cyan-100">16 ≤ n ≤ 64</span>): combining absorption, emission,
                magnetic circular dichroism, and TD-DFT analysis to connect fluorination, frontier orbitals, symmetry, and
                aggregation behavior.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToViewer}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/45 bg-cyan-300/12 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-300/22"
                >
                  Explore 3D Models
                  <ArrowRight className="h-4 w-4" />
                </button>
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

            <div className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white">Methods In Focus</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200/90">
                <li className="flex items-start gap-2">
                  <Beaker className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>TD-DFT (CAM-B3LYP/6-31G(d,p)) for orbital assignments and excited-state trends.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Waves className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <span>MCD to resolve Q-band structures, A/B Faraday terms, and low-symmetry splitting effects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Atom className="mt-0.5 h-4 w-4 text-indigo-300" />
                  <span>X-ray/solution comparisons to connect steric substitution with monomer-dimer equilibria.</span>
                </li>
              </ul>
              <p className="mt-4 rounded-lg bg-slate-900/65 p-3 font-mono text-xs text-cyan-100/85">
                Viewer Stack Choice: 3Dmol.js (official TypeScript-ready molecular WebGL library, integrated in React)
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="glass-panel rounded-3xl p-6 md:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
              <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Why Fluorination Matters</p>
              <p className="mt-3 text-sm text-slate-100/90 md:text-base">
                Fluorinated phthalocyanines are electron-deficient, redox-stable, heat-resistant tetrapyrroles with no C-H bonds.
                Peripheral F and bulky iso-C<sub>3</sub>F<sub>7</sub> groups tune electronic states while improving chemical robustness.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
              <p className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Core Interpretation Frame</p>
              <p className="mt-3 text-sm text-slate-100/90 md:text-base">
                The paper tracks substitution-driven changes in HOMO/HOMO-1 ordering and Q-band intensity using the Gouterman
                4-orbital model, then links those electronic shifts to observed aggregation and MCD behavior in solution.
              </p>
            </article>
          </div>
        </motion.section>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <MolecularViewer />
        </motion.div>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <SpectralChart />
        </motion.div>

        <motion.section
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="glass-panel rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Aggregation, Symmetry, and MCD Deep Dive</h2>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
              <h3 className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Aggregation</h3>
              <p className="mt-3 text-sm text-slate-100/90">
                MCD and absorption analysis indicate stronger dimer contribution for F16/F40 and lower dimer fractions for F52/F64,
                consistent with increasing steric blocking as substitution density grows.
              </p>
              <p className="mt-3 text-sm text-slate-300/90">
                Solvent dependence is explicit: CHCl<sub>3</sub> favors monomers, while ethanol enhances aggregation.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
              <h3 className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">Symmetry Reduction</h3>
              <p className="mt-3 text-sm text-slate-100/90">
                F16 and idealized F64 retain near-D4h-like rotational characteristics, while F40/F52 trends toward C2v-like symmetry
                reductions due to substituent distribution.
              </p>
              <p className="mt-3 text-sm text-slate-300/90">
                These reductions are reflected in band broadening and splitting behavior in the Q region.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5">
              <h3 className="font-mono text-xs tracking-[0.2em] text-cyan-200/80">MCD Interpretation</h3>
              <p className="mt-3 text-sm text-slate-100/90">
                MCD isolates subtle Q−/Q+ structure and distinguishes field-driven structure from substitution/symmetry effects,
                enabling assignment of low-energy transitions beyond simple UV-visible inspection.
              </p>
              <p className="mt-3 text-sm text-slate-300/90">
                Reported peak-to-trough spans and TD-DFT comparisons support the substitution-driven electronic interpretation.
              </p>
            </article>
          </div>
        </motion.section>

        <motion.section
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="glass-panel rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Real-World Application Landscape</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application, index) => {
              const Icon = application.icon

              return (
                <motion.article
                  key={application.title}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border border-cyan-100/20 bg-slate-950/50 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-white">{application.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-200/90">{application.detail}</p>
                  <p className="mt-2 font-mono text-xs text-cyan-100/70">Use Case {String(index + 1).padStart(2, '0')}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.section>

        <footer className="rounded-2xl border border-cyan-100/15 bg-slate-950/50 px-5 py-4 text-sm text-slate-300/90">
          Citation: Chan D, Zhang A, Wong DL, Mercier D, Pelmuş M, Patel HH, Gorun SM, Stillman MJ.{' '}
          <span className="italic">J. Porphyrins Phthalocyanines</span> (2025) 29:1249-1261. DOI:{' '}
          <a className="text-cyan-200 underline decoration-cyan-400/50 underline-offset-2" href={DOI_URL} target="_blank" rel="noreferrer">
            10.1142/S1088424625501093
          </a>
        </footer>
      </div>
    </motion.main>
  )
}

export default App
