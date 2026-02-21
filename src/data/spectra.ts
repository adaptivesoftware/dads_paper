export type SpectrumPoint = {
  wavelength: number
  f16: number
  f64: number
}

const gaussian = (wavelength: number, center: number, width: number, amplitude: number) => {
  return amplitude * Math.exp(-((wavelength - center) ** 2) / (2 * width ** 2))
}

export const monomerQBandCenters = {
  F16: 677,
  F40: 692,
  F52: 700,
  F64: 688,
} as const

export const spectraData: SpectrumPoint[] = Array.from({ length: 97 }, (_, index) => {
  const wavelength = 300 + index * 5

  const f16 =
    gaussian(wavelength, 348, 19, 1.08) +
    gaussian(wavelength, 390, 15, 0.28) +
    gaussian(wavelength, 677, 24, 0.96) +
    gaussian(wavelength, 634, 17, 0.22)

  const f64 =
    gaussian(wavelength, 356, 22, 0.9) +
    gaussian(wavelength, 402, 17, 0.26) +
    gaussian(wavelength, 688, 20, 1.19) +
    gaussian(wavelength, 722, 15, 0.18)

  return {
    wavelength,
    f16: Number(f16.toFixed(4)),
    f64: Number(f64.toFixed(4)),
  }
})
