import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Header from './components/Header'
import Cursor from './components/Cursor'
import Hero from './sections/Hero'
import Numbers from './sections/Numbers'
import Story from './sections/Story'
import Work from './sections/Work'
import Method from './sections/Method'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import { startSmoothScroll } from './lib/smooth'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  useEffect(() => {
    startSmoothScroll()
    // Fonts change line lengths; recompute pins/triggers once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <Cursor />
      <div className="grain" aria-hidden />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Numbers />
        <Story />
        <Work />
        <Method />
        <Stack />
        <Contact />
      </main>
    </MotionConfig>
  )
}
