
import {
  Sparkles,
  LayoutDashboard,
  Database,
  Table2,
  History,
  Settings,
  CircleHelp,
  ChevronDown,
  Plus,
  PanelLeftClose,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, active: true },
  { name: 'AI SQL Workspace', icon: Sparkles },
  { name: 'Database Explorer', icon: Database },
  { name: 'Tables & Schema', icon: Table2 },
  { name: 'Query History', icon: History },
]

function Sidebar() {
  return (
    <aside className="relative flex h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0a0a12]/90 px-4 py-5 text-white backdrop-blur-2xl">

      <div className="mb-10 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/10">
            <Sparkles size={21} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">IntelliSQL</h1>
            <p className="text-[10px] tracking-[2px] text-zinc-500">AI DATABASE STUDIO</p>
          </div>
        </div>
        <button className="text-zinc-500 transition hover:text-white">
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="mb-7">
        <button className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <Database size={17} />
            </div>
            <div>
              <p className="text-xs font-medium">My Workspace</p>
              <p className="mt-1 text-[10px] text-zinc-500">PostgreSQL Database</p>
            </div>
          </div>
          <ChevronDown size={15} className="text-zinc-500" />
        </button>
      </div>

      <p className="mb-3 px-3 text-[10px] font-semibold tracking-[2px] text-zinc-600">
        WORKSPACE
      </p>

      <nav className="flex flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] transition-all ${
                item.active
                  ? 'border border-indigo-400/15 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-950/20'
                  : 'border border-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Icon size={17} />
              {item.name}
            </button>
          )
        })}
      </nav>

      <button className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-3 text-xs text-zinc-400 transition hover:border-indigo-400/40 hover:text-indigo-300">
        <Plus size={15} />
        New Query
      </button>

      <div className="mt-auto">
        <div className="mb-4 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.06] p-3">
          <div className="mb-2 flex items-center gap-2 text-indigo-300">
            <Sparkles size={15} />
            <span className="text-xs font-medium">IntelliSQL AI</span>
          </div>
          <p className="text-[11px] leading-5 text-zinc-500">
            Your intelligent assistant for exploring data and generating SQL.
          </p>
        </div>

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white">
          <CircleHelp size={17} />
          Help & Support
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white">
          <Settings size={17} />
          Settings
        </button>

        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.08] pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold">
            JS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">Jay Shyara</p>
            <p className="mt-1 text-[10px] text-zinc-500">Personal Workspace</p>
          </div>
          <ChevronDown size={15} className="text-zinc-500" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar