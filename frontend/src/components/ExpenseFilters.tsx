import { FiSearch } from "react-icons/fi";
import type { ExpenseFiltersState } from "../types/filter";

const EXPENSE_TYPE_OPTIONS = [
    { value: 'all', label: 'ทั้งหมด', activeClass: 'bg-ink/10 text-ink' },
    { value: 'income', label: 'รายรับ', activeClass: 'bg-sage/15 text-sage' },
    { value: 'expense', label: 'รายจ่าย', activeClass: 'bg-clay/15 text-clay' },
]

const EXPENSE_CATEGORY_OPTIONS = [
    { value: 'all', label: 'ทุกหมวดหมู่' },
    { value: 'food', label: 'อาหาร' },
    { value: 'travel', label: 'เดินทาง' },
    { value: 'accommodation', label: 'ที่พัก' },
    { value: 'entertainment', label: 'บันเทิง' },
    { value: 'health', label: 'สุขภาพ' },
    { value: 'salary', label: 'เงินเดือน' },
    { value: 'other', label: 'อื่นๆ' },
]

const TIME_RANGE_OPTIONS = [
    { value: 'all', label: 'ทุกช่วงเวลา' },
    { value: 'today', label: 'วันนี้' },
    { value: '7days', label: '7 วัน' },
    { value: 'thismonth', label: 'เดือนนี้' },
    { value: 'thisyear', label: 'ปีนี้' },
]

const SORT_OPTIONS = [
    { value: 'date-desc', label: 'ใหม่ → เก่า' },
    { value: 'date-asc', label: 'เก่า → ใหม่' },
    { value: 'amount-desc', label: 'เงิน มาก → น้อย' },
    { value: 'amount-asc', label: 'เงิน น้อย → มาก' },
]

const SELECT_CLASS = 'rounded-lg border border-line bg-white/80 px-2 py-1 text-xs text-ink outline-none focus:border-sage'

type ExpenseFiltersProps = {
    filters: ExpenseFiltersState
    setFilters: React.Dispatch<
      React.SetStateAction<ExpenseFiltersState>
    >
    DEFAULT_FILTERS: ExpenseFiltersState
  }

function ExpenseFilters({ filters, setFilters, DEFAULT_FILTERS }: ExpenseFiltersProps) {


    const updateFilter = (key: keyof ExpenseFiltersState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const hasActiveFilters = Object.entries(DEFAULT_FILTERS).some(
        ([key, value]) => filters[key as keyof ExpenseFiltersState] !== value
    )

    const resetFilters = () => setFilters(DEFAULT_FILTERS as unknown as ExpenseFiltersState)

    return (
        <div className='mt-4 rounded-2xl border border-line bg-white/60 p-3'>
            <div className='relative'>
                <FiSearch className='absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40' size={15} />
                <input
                    type="search"
                    placeholder="ค้นหาชื่อหรือโน็ต..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className='w-full rounded-lg border border-line bg-white/80 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-sage'
                />
            </div>

            <div className='mt-2 flex flex-wrap items-center gap-1.5'>
                <div
                    className='inline-flex rounded-lg border border-line bg-line/30 p-0.5'
                    role="group"
                    aria-label="ประเภทรายการ"
                >
                    {EXPENSE_TYPE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFilter('type', option.value)}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${filters.type === option.value
                                ? option.activeClass
                                : 'text-ink/60 hover:text-ink'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <select
                    aria-label="หมวดหมู่"
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className={SELECT_CLASS}
                >
                    {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                <select
                    aria-label="ช่วงเวลา"
                    value={filters.timeRange}
                    onChange={(e) => updateFilter('timeRange', e.target.value)}
                    className={SELECT_CLASS}
                >
                    {TIME_RANGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                <select
                    aria-label="เรียงลำดับ"
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className={SELECT_CLASS}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={resetFilters}
                        className='ml-auto text-xs text-ink/50 transition hover:text-clay'
                    >
                        ล้างตัวกรอง
                    </button>
                )}
            </div>
        </div>
    );
}

export default ExpenseFilters;
