import React, { useState, useRef } from 'react';
import { Save, Download, Upload, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { changePin, verifyPin, exportData, importData, resetToDefaults } from '../../services/storage';
import AdminModal from './AdminModal';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const [pinForm, setPinForm] = useState({ current: '', newPin: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePin = async () => {
    setPinError('');
    setPinSuccess(false);

    if (pinForm.newPin.length < 4) {
      setPinError('El PIN debe tener al menos 4 dígitos');
      return;
    }
    if (pinForm.newPin !== pinForm.confirm) {
      setPinError('Los PINs no coinciden');
      return;
    }
    const valid = await verifyPin(pinForm.current);
    if (!valid) {
      setPinError('PIN actual incorrecto');
      return;
    }
    await changePin(pinForm.newPin);
    setPinForm({ current: '', newPin: '', confirm: '' });
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pudu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result as string);
        window.location.reload();
      } catch {
        alert('Error al importar: archivo inválido');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-pudu-earth mb-6">Ajustes</h1>

      {/* Business Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-display font-semibold text-pudu-earth mb-4">Datos del negocio</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
            <input
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono WhatsApp</label>
            <input
              value={form.whatsappPhone}
              onChange={e => setForm({ ...form, whatsappPhone: e.target.value })}
              placeholder="56912345678"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
            />
            <p className="text-xs text-gray-400 mt-1">Formato: código país + número, sin +</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen hero (URL)</label>
            <input
              value={form.heroImageUrl}
              onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline del footer</label>
            <input
              value={form.footerTagline}
              onChange={e => setForm({ ...form, footerTagline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-4 py-2.5 bg-pudu-green hover:bg-pudu-green-dark text-white font-medium rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Guardado!' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* PIN Change */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-display font-semibold text-pudu-earth mb-4">Cambiar PIN</h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="PIN actual"
            value={pinForm.current}
            onChange={e => setPinForm({ ...pinForm, current: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
          <input
            type="password"
            placeholder="Nuevo PIN"
            value={pinForm.newPin}
            onChange={e => setPinForm({ ...pinForm, newPin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
          <input
            type="password"
            placeholder="Confirmar nuevo PIN"
            value={pinForm.confirm}
            onChange={e => setPinForm({ ...pinForm, confirm: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
          {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
          {pinSuccess && <p className="text-green-600 text-sm">PIN cambiado exitosamente</p>}
          <button
            onClick={handleChangePin}
            className="px-4 py-2.5 bg-pudu-earth text-white font-medium rounded-xl hover:bg-pudu-earth-light transition-colors"
          >
            Cambiar PIN
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-display font-semibold text-pudu-earth mb-4">Datos</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar datos
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" /> Importar datos
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Restaurar valores de fábrica
          </button>
        </div>
      </div>

      <AdminModal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Restaurar valores de fábrica">
        <p className="text-gray-600 mb-6">
          Esto reemplazará todos los productos, cajas y ajustes por los valores originales. <strong>Los pedidos no se borrarán.</strong>
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
            Restaurar
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
