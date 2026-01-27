import React from 'react';

interface SolubilityModalProps {
  onClose: () => void;
}

export const SolubilityModal: React.FC<SolubilityModalProps> = ({ onClose }) => {
  const rules = [
    { ion: "Alkali Metals & NH₄⁺", rule: "Always Soluble", exceptions: "None" },
    { ion: "Nitrates (NO₃⁻)", rule: "Always Soluble", exceptions: "None" },
    { ion: "Chlorides (Cl⁻)", rule: "Soluble", exceptions: "Ag⁺, Hg₂²⁺, Pb²⁺" },
    { ion: "Sulfates (SO₄²⁻)", rule: "Soluble", exceptions: "Ca²⁺, Sr²⁺, Ba²⁺, Pb²⁺, Ag⁺" },
    { ion: "Carbonates (CO₃²⁻)", rule: "Insoluble", exceptions: "Alkali Metals, NH₄⁺" },
    { ion: "Hydroxides (OH⁻)", rule: "Insoluble", exceptions: "Alkali Metals, Ca²⁺, Sr²⁺, Ba²⁺" },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Aqueous Solubility Matrix</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Ions</th>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Property</th>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Critical Exceptions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                {rules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{rule.ion}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${rule.rule === 'Soluble' || rule.rule === 'Always Soluble' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {rule.rule}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs italic text-slate-500 dark:text-slate-400">{rule.exceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Reference standard 25°C @ 1atm</p>
        </div>
      </div>
    </div>
  );
};