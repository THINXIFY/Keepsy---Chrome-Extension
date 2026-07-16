import type { ReactNode } from 'react'
import { ArrowLeft, Database, Lock, ShieldCheck } from 'lucide-react'

const PRIVACY_POLICY_VERSION = '1.0.0'

function PolicySection({ icon: Icon, title, points }: { icon: typeof ShieldCheck; title: string; points: string[] }) {
  return <section className="rounded-panel border border-line bg-surface p-3.5">
    <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-[#E6E8F0]"><span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-[#81b0ff]"><Icon size={13} /></span>{title}</div>
    <ul className="space-y-2">{points.map(point => <li key={point} className="flex items-start gap-2 text-[11px] leading-5 text-muted"><span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#81b0ff]/70" />{point}</li>)}</ul>
  </section>
}

export function PrivacyPolicy({ onBack }: { onBack: () => void }): ReactNode {
  return <div className="absolute inset-0 z-20 flex flex-col bg-midnight">
    <header className="flex items-center gap-2 px-4 pb-3 pt-4"><button onClick={onBack} aria-label="Back" className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><ArrowLeft size={18} /></button><h1 className="text-[15px] font-semibold tracking-[-.02em] text-white">Privacy Policy</h1></header>
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">
      <div className="rounded-panel border border-primary/20 bg-primary/[.06] p-3.5">
        <p className="text-[11px] leading-5 text-[#E6E8F0]"><span className="font-semibold text-white">Keepsy</span> is designed with privacy as a priority. Your information stays under your control, on your device, at all times.</p>
      </div>

      <PolicySection icon={Database} title="Local-First by Design" points={[
        'All your data is stored locally in your browser by default.',
        'Your saved notes, links, emails, phone numbers, crypto wallets, code snippets, API keys, collections, categories, tags, and custom icons remain under your control.',
        'Import and Export operations are performed locally on your device.',
      ]} />

      <PolicySection icon={ShieldCheck} title="No Selling, No Sharing" points={[
        'Keepsy does not upload, sell, or share your personal information with third parties.',
        'No personal content is transmitted to external servers unless a future feature explicitly requires it and you choose to enable it.',
        'Keepsy does not collect analytics about your saved content.',
      ]} />

      <PolicySection icon={Lock} title="Permissions & Your Control" points={[
        'The extension only requests the permissions necessary to provide its features.',
        'You can delete your data at any time using the built-in "Clear All Data" option in Settings.',
        'Future cloud synchronization or AI features (if introduced) will always require explicit user consent before any data is transmitted.',
      ]} />

      <div className="space-y-0.5 border-t border-line px-1 pt-4 text-center">
        <p className="text-[11px] font-medium text-[#E6E8F0]">Privacy Policy</p>
        <p className="text-[10px] text-muted">Version {PRIVACY_POLICY_VERSION}</p>
        <p className="text-[10px] text-muted">Developed by: <a href="https://thinxify.com" target="_blank" rel="noreferrer" className="text-[#81b0ff] transition hover:text-white">THINXIFY.COM</a></p>
      </div>
    </div>
  </div>
}
