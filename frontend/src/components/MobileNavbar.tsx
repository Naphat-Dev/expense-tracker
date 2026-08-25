import {
  Plus,
  SlidersHorizontal,
  WalletCards,
  List,
  ChartNoAxesCombined,
} from 'lucide-react'

type MobileNavbarProps = {
  onNavigate: (id: string) => void
}

const NAV_ITEMS = [
  { id: 'add', label: 'เพิ่ม', icon: Plus },
  { id: 'filters', label: 'Filter', icon: SlidersHorizontal },
  { id: 'summary', label: 'สรุป', icon: WalletCards },
  { id: 'expenses', label: 'รายการ', icon: List },
  { id: 'charts', label: 'กราฟ', icon: ChartNoAxesCombined },
] as const

function MobileNavbar({ onNavigate }: MobileNavbarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium text-muted transition hover:bg-paper hover:text-ink active:scale-95"
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNavbar