// Adjust the import path according to your project structure.
import HoverRevealCards, { type CardItem } from '@/components/ui/cards';

// Sample data for the demo, matching the structure of the CardItem interface.
// Unsplash URLs are cleaned to a single query string (the originals had a
// duplicated `?q=...` tail, which produces an invalid URL).
const demoItems: CardItem[] = [
  {
    id: 1,
    title: 'Echoes',
    subtitle: 'Grand Canyon',
    imageUrl:
      'https://images.unsplash.com/photo-1723633345813-4fa3642d13f6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Highest Mountain',
    subtitle: 'Yosemite',
    imageUrl:
      'https://images.unsplash.com/premium_photo-1673283379754-27635807eaf8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Deep Desert',
    subtitle: 'Sahara',
    imageUrl:
      'https://images.unsplash.com/photo-1592782480535-847fa6dbff97?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Breath-taking',
    subtitle: 'Landscape',
    imageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
  },
];

/**
 * A demo page to showcase the HoverRevealCards component.
 */
const HoverRevealCardsDemo = () => {
  return (
    // Centering the component for a clean preview.
    // `bg-background` ensures it adapts to the current theme (light/dark).
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <HoverRevealCards items={demoItems} />
    </div>
  );
};

export default HoverRevealCardsDemo;
