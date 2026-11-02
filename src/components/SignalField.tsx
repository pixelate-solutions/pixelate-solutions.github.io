/**
 * Signature visual: two particle streams (cyan = engineering, ember = sales) enter from the left,
 * braid into a double helix where the portrait sits, and leave as a single bone-white signal.
 * All motion is computed in the vertex shader, so the CPU does nothing per frame except set uniforms.
 * Lazy-loaded; never mounted when the user prefers reduced motion.
 */
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform vec2 uView;      // visible width, height in world units
  uniform float uMergeX;   // 0..1 across the viewport where the streams fully braid
  uniform vec3 uBuild;
  uniform vec3 uSell;
  uniform vec3 uBone;
  attribute vec4 aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  float gauss(float r) { return (r - 0.5) * 2.0 * (0.4 + 0.6 * r * r); }

  void main() {
    float speed = 0.028 + 0.02 * aSeed.w;
    float u = fract(aSeed.x + uTime * speed);
    float s = aSeed.y < 0.5 ? -1.0 : 1.0;

    float merge = smoothstep(uMergeX - 0.42, uMergeX, u);
    float tail = smoothstep(uMergeX, 1.0, u);
    float ph = u * 6.2831 * 2.4 - uTime * 0.55;

    float H = uView.y;
    float W = uView.x;
    float x = (u - 0.5) * W * 1.08;

    float centre = -0.06 * H + sin(u * 3.1 + uTime * 0.18) * 0.05 * H;
    float apart = s * H * 0.3 * (1.0 - merge) + sin(ph * 0.55 + s * 1.7) * 0.05 * H * (1.0 - merge);
    float helixA = H * (0.085 * merge) * (1.0 - 0.55 * tail);
    float y = centre + apart + helixA * sin(ph + (s > 0.0 ? 3.14159 : 0.0));
    float z = helixA * cos(ph + (s > 0.0 ? 3.14159 : 0.0)) * 1.6;

    float thick = mix(0.075, 0.018, merge) + tail * 0.03;
    y += gauss(aSeed.z) * thick * H;
    z += gauss(fract(aSeed.z * 7.13)) * thick * H * 1.2;

    vec3 pos = vec3(x, y, z);

    vec2 d = pos.xy - uMouse;
    float m = exp(-dot(d, d) * 9.0);
    pos.xy += normalize(d + 1e-4) * m * 0.22;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float packet = step(0.988, aSeed.w);
    gl_PointSize = (1.1 + aSeed.w * 2.2 + packet * 3.5) * uPixelRatio * (6.0 / -mv.z);

    vec3 base = s < 0.0 ? uBuild : uSell;
    vColor = mix(base, uBone, smoothstep(0.15, 0.9, merge) * 0.55 + tail * 0.4);
    float edge = smoothstep(0.0, 0.07, u) * (1.0 - smoothstep(0.93, 1.0, u));
    vAlpha = edge * uIntro * (0.28 + 0.55 * aSeed.w + packet * 0.6) * (1.0 + m * 1.5);
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * a, a * vAlpha);
  }
`

function Streams({ count, mergeX }: { count: number; mergeX: number }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const { viewport, camera } = useThree()
  const mouse = useRef(new THREE.Vector2(99, 99))
  const target = useRef(new THREE.Vector2(99, 99))

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const seeds = new Float32Array(count * 4)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      seeds[i * 4] = Math.random()
      seeds[i * 4 + 1] = Math.random()
      seeds[i * 4 + 2] = Math.random()
      seeds[i * 4 + 3] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uView: { value: new THREE.Vector2(1, 1) },
      uMergeX: { value: mergeX },
      uBuild: { value: new THREE.Color('#9fbdd3') },
      uSell: { value: new THREE.Color('#f26b3a') },
      uBone: { value: new THREE.Color('#f4f1ea') },
    }),
    [mergeX],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const m = material.current
    if (!m) return
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0])
    m.uniforms.uView.value.set(vp.width, vp.height)
    m.uniforms.uTime.value += Math.min(delta, 0.05)
    m.uniforms.uIntro.value = Math.min(1, m.uniforms.uIntro.value + delta * 0.6)
    mouse.current.lerp(target.current, 0.08)
    m.uniforms.uMouse.value.set((mouse.current.x * vp.width) / 2, (mouse.current.y * vp.height) / 2)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function SignalField({ active, mergeX }: { active: boolean; mergeX: number }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <Streams count={mobile ? 5000 : 12000} mergeX={mergeX} />
    </Canvas>
  )
}
