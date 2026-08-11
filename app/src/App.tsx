import HoverRevealCardsDemo from './demo'
import { AboutDemo } from '@/components/blocks/cta-section-with-gallery-demo'
import DesertDriftDemo from '@/components/ui/desert-drift-demo'
import { CTADemo } from '@/components/blocks/cta-with-rectangle-demo'
import BorderBeamPanelDemo from '@/components/ui/border-beam-panel-demo'
import FloatingPathsBackgroundExample from '@/components/ui/floating-paths-demo'

function App() {
  return (
    <main className="bg-background text-foreground">
      <AboutDemo />
      <HoverRevealCardsDemo />
      <BorderBeamPanelDemo />
      <FloatingPathsBackgroundExample />
      <DesertDriftDemo />
      <CTADemo />
    </main>
  )
}

export default App
