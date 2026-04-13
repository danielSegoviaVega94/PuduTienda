import { useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import Landing from './components/Landing';
import Customizer from './components/Customizer';
import AdminLayout from './components/admin/AdminLayout';
import { BoxTemplate } from './types';

function Storefront() {
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

export default function App() {
  const route = useHashRoute();

  if (route.page === 'admin') {
    return <AdminLayout section={route.section} />;
  }

  return <Storefront />;
}
