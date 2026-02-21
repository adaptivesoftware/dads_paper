import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function AtmosphereBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const parent = canvas.parentElement

    if (!parent) {
      return
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120)
    camera.position.z = 10

    const count = 1200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cyan = new THREE.Color('#71f7ff')
    const emerald = new THREE.Color('#5ff7c8')
    const indigo = new THREE.Color('#8da3ff')

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3
      const radius = 24 * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = (radius * Math.cos(phi)) / 1.4

      const mix = Math.random()
      const color = mix < 0.4 ? cyan : mix < 0.75 ? emerald : indigo
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0.46,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const starField = new THREE.Points(geometry, material)
    scene.add(starField)

    const resize = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    resize()

    let rafId = 0
    const animate = () => {
      starField.rotation.y += 0.00045
      starField.rotation.x += 0.00018
      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
}
