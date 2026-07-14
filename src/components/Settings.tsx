import { useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  Database,
  FolderTree,
  Gamepad2,
  Image as ImageIcon,
  Info,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import type { KeepsyItem, SortMode } from '../types'
import type { AutoEmptyTrash, HomeView, Settings as SettingsData } from '../lib/settings'
import { InlineSelect } from './ui/InlineSelect'
import { Switch } from './ui/Switch'

function SectionCard({ icon: Icon, title, children }: { icon: typeof Zap; title: string; children: ReactNode }) {
  return <section className="rounded-panel border border-line bg-surface p-3.5">
    <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-[#E6E8F0]"><span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-[#81b0ff]"><Icon size={13} /></span>{title}</div>
    <div className="space-y-1">{children}</div>
  </section>
}

function Row({ label, detail, control, onClick, destructive }: { label: string; detail?: string; control?: ReactNode; onClick?: () => void; destructive?: boolean }) {
  const labelBlock = <div className="min-w-0 flex-1"><p className={`text-xs font-medium ${destructive ? 'text-[#ff9fb5]' : 'text-[#E6E8F0]'}`}>{label}</p>{detail && <p className="mt-0.5 text-[10px] leading-4 text-muted">{detail}</p>}</div>
  if (onClick) return <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/[.05] focus:outline-none focus:ring-2 focus:ring-primary">{labelBlock}{control}</button>
  return <div className="flex items-center gap-3 rounded-lg px-2 py-2">{labelBlock}{control}</div>
}

const homeViewOptions: { value: HomeView; label: string }[] = [{ value: 'All', label: 'All' }, { value: 'Recent', label: 'Recent' }, { value: 'Favorites', label: 'Favorites' }, { value: 'Pinned', label: 'Pinned' }]
const sortOptions: { value: SortMode; label: string }[] = [{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'updated', label: 'Recently updated' }, { value: 'az', label: 'A-Z' }]
const autoEmptyOptions: { value: AutoEmptyTrash; label: string }[] = [{ value: 'never', label: 'Never' }, { value: '30', label: 'After 30 days' }, { value: '60', label: 'After 60 days' }, { value: '90', label: 'After 90 days' }]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function Settings({
  onClose,
  settings,
  onChangeSettings,
  trashCount,
  onClearTrash,
  onClearAllData,
  onExportBackup,
  onImportBackup,
  onManageCollections,
  onManageCategories,
  onManageTags,
  onViewCustomIcons,
  onViewOnboarding,
  onPlayGame2048,
  customIconItems,
  storageBytes,
  version,
}: {
  onClose: () => void
  settings: SettingsData
  onChangeSettings: (value: Partial<SettingsData>) => void
  trashCount: number
  onClearTrash: () => void
  onClearAllData: () => void
  onExportBackup: () => void
  onImportBackup: (file: File) => void
  onManageCollections: () => void
  onManageCategories: () => void
  onManageTags: () => void
  onViewCustomIcons: () => void
  onViewOnboarding: () => void
  onPlayGame2048: () => void
  customIconItems: KeepsyItem[]
  storageBytes: number | null
  version: string
}) {
  const [confirmClearTrash, setConfirmClearTrash] = useState(false)
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  return <div className="absolute inset-0 z-20 flex flex-col bg-midnight">
    <header className="flex items-center gap-2 px-4 pb-3 pt-4"><button onClick={onClose} aria-label="Back" className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><ArrowLeft size={18} /></button><h1 className="text-[15px] font-semibold tracking-[-.02em] text-white">Settings</h1></header>
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">

      <SectionCard icon={Zap} title="Quick Actions">
        <Row label="Export Backup" detail="Save items, collections, categories & tags as a file" onClick={onExportBackup} />
        <label className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/[.05]"><div className="min-w-0 flex-1"><p className="text-xs font-medium text-[#E6E8F0]">Import Backup</p><p className="mt-0.5 text-[10px] leading-4 text-muted">Restore from a previously exported file</p></div><input type="file" accept="application/json" className="hidden" onChange={e => e.target.files?.[0] && onImportBackup(e.target.files[0])} /></label>
        <Row label="Clear Trash" detail={`${trashCount} item${trashCount === 1 ? '' : 's'} currently in Trash`} destructive onClick={() => setConfirmClearTrash(current => !current)} />
        {confirmClearTrash && <div className="flex items-center gap-2 rounded-lg bg-[#c94166]/10 px-2.5 py-2"><p className="flex-1 text-[10px] leading-4 text-muted">Permanently delete all {trashCount} trashed item{trashCount === 1 ? '' : 's'}? This cannot be undone.</p><button onClick={() => { onClearTrash(); setConfirmClearTrash(false) }} disabled={!trashCount} className="shrink-0 rounded-lg bg-[#c94166]/20 px-2.5 py-1.5 text-[10px] font-medium text-[#ff9fb5] transition hover:bg-[#c94166]/30 disabled:opacity-40">Confirm</button></div>}
      </SectionCard>

      <SectionCard icon={SlidersHorizontal} title="General">
        <Row label="Default Home View" detail="Tab shown when Keepsy opens" control={<InlineSelect value={settings.defaultHomeView} options={homeViewOptions} onChange={value => onChangeSettings({ defaultHomeView: value as HomeView })} placeholder="All" />} />
        <Row label="Default Sort Order" control={<InlineSelect value={settings.defaultSort} options={sortOptions} onChange={value => onChangeSettings({ defaultSort: value as SortMode })} placeholder="Newest" />} />
        <Row label="Confirm Before Delete" detail="Ask before moving an item to Trash" control={<Switch checked={settings.confirmBeforeDelete} onChange={value => onChangeSettings({ confirmBeforeDelete: value })} label="Confirm before delete" />} />
        <Row label="Auto Empty Trash" detail="Permanently remove old trashed items" control={<InlineSelect value={settings.autoEmptyTrash} options={autoEmptyOptions} onChange={value => onChangeSettings({ autoEmptyTrash: value as AutoEmptyTrash })} placeholder="Never" />} />
      </SectionCard>

      <SectionCard icon={Palette} title="Appearance">
        <Row label="Compact Mode" detail="Tighter spacing, more items per screen" control={<Switch checked={settings.compactMode} onChange={value => onChangeSettings({ compactMode: value })} label="Compact mode" />} />
        <Row label="Animations" detail="Motion and transition effects" control={<Switch checked={settings.animations} onChange={value => onChangeSettings({ animations: value })} label="Animations" />} />
        <Row label="Theme" detail="Dark (more themes coming soon)" />
      </SectionCard>

      <SectionCard icon={Database} title="Data">
        <Row label="Storage Usage" detail={storageBytes === null ? 'Calculating...' : `${formatBytes(storageBytes)} of ~10 MB used, stored locally`} />
        <Row label="Clear All Data" detail="Erase every item, collection, category and tag" destructive onClick={() => setConfirmClearAll(current => !current)} />
        {confirmClearAll && <div className="flex items-center gap-2 rounded-lg bg-[#c94166]/10 px-2.5 py-2"><p className="flex-1 text-[10px] leading-4 text-muted">This permanently erases everything Keepsy has stored. This cannot be undone.</p><button onClick={() => { onClearAllData(); setConfirmClearAll(false) }} className="shrink-0 rounded-lg bg-[#c94166]/20 px-2.5 py-1.5 text-[10px] font-medium text-[#ff9fb5] transition hover:bg-[#c94166]/30">Confirm</button></div>}
      </SectionCard>

      <SectionCard icon={FolderTree} title="Categories & Organization">
        <Row label="Manage Collections" onClick={onManageCollections} />
        <Row label="Manage Categories" onClick={onManageCategories} />
        <Row label="Manage Tags" onClick={onManageTags} />
      </SectionCard>

      <SectionCard icon={ImageIcon} title="Custom Icons">
        <Row label="Uploaded Icons" detail={`${customIconItems.length} item${customIconItems.length === 1 ? '' : 's'} with a custom icon`} onClick={onViewCustomIcons} />
      </SectionCard>

      <SectionCard icon={Gamepad2} title="Mini Games">
        <Row label="Browse Games" detail="Quick bonus games for a 30-second break" onClick={onPlayGame2048} />
      </SectionCard>

      <SectionCard icon={ShieldCheck} title="Privacy">
        <p className="px-2 text-[11px] leading-5 text-muted">Everything is stored locally in your browser. No data is sent to external servers.</p>
      </SectionCard>

      <SectionCard icon={Info} title="About">
        <Row label="View Welcome Guide" detail="Replay the onboarding walkthrough" onClick={onViewOnboarding} />
        <Row label="Keepsy Version" detail={version} />
        <Row label="Developed by" detail="THINXIFY.COM" onClick={() => window.open('https://thinxify.com', '_blank', 'noopener,noreferrer')} />
      </SectionCard>
    </div>
  </div>
}
