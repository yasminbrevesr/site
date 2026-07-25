import {
  ContainerAnimated,
  ContainerStagger,
  GalleryGrid,
  GalleryGridCell,
} from "@/components/blocks/cta-section-with-gallery"
import { Button } from "@/components/ui/button"

const IMAGES = [
  "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1733680958774-39a0e8a64a54?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1548783307-f63adc3f200b?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1703622377707-29bc9409aaf2?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

export const AboutDemo = () => {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-8 py-12 md:grid-cols-2">
        <ContainerStagger>
          <ContainerAnimated className="mb-4 block text-xs font-medium text-rose-500 md:text-sm">
            Innovate &amp; Grow
          </ContainerAnimated>
          <ContainerAnimated className="text-4xl font-semibold md:text-[2.4rem] tracking-tight">
            Scale Your Business Through Innovation
          </ContainerAnimated>
          <ContainerAnimated className="my-4 text-base text-slate-700 md:my-6 md:text-lg">
            Transform your startup&apos;s potential through innovative solutions
            and strategic growth. We help businesses adapt, evolve, and thrive
            in today&apos;s competitive marketplace.
          </ContainerAnimated>
          <ContainerAnimated>
            <Button className="bg-rose-500 hover:bg-rose-500/90">
              Start Scaling Today
            </Button>
          </ContainerAnimated>
        </ContainerStagger>

        <GalleryGrid>
          {IMAGES.map((imageUrl, index) => (
            <GalleryGridCell index={index} key={index}>
              <img
                className="size-full object-cover object-center"
                width="100%"
                height="100%"
                src={imageUrl}
                alt=""
              />
            </GalleryGridCell>
          ))}
        </GalleryGrid>
      </div>
    </section>
  )
}

export default AboutDemo
