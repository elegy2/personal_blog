import { h } from 'preact';
import { useState } from 'preact/hooks';
import TarotGallery from '../components/TarotGallery.jsx';
import Live2D from '../components/Live2D.jsx';

export default function TarotPage() {
  const [selectedModel, setSelectedModel] = useState(0);

  return (
    <div>
      <TarotGallery onSelect={(index) => setSelectedModel(index)} />
      <Live2D selectedModel={selectedModel} />
    </div>
  );
}
