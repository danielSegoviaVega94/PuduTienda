import { useState } from 'react';
import Landing from './components/Landing';
import Customizer from './components/Customizer';
import { BoxTemplate } from './types';

export default function App() {
  const [selectedBox, setSelectedBox] = useState<BoxTemplate | null>(null);

  return (
    <div className="font-sans">
      {selectedBox ? (
        <Customizer box={selectedBox} onBack={() => setSelectedBox(null)} />
      ) : (
        <Landing onSelectBox={setSelectedBox} />
      )}
    </div>
  );
}
