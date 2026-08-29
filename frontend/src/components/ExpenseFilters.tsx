import { useEffect, useState } from "react"
import {
    FiSearch,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiChevronDown,
} from "react-icons/fi"
import type { ExpenseFiltersState } from "../types/filter"
import { CATEGORIES, CATEGORY_LABELS } from "../types/expense"

const EXPENSE_TYPE_OPTIONS = [
    { value: "all", label: "ทั้งหมด" },
    { value: "income", label: "รายรับ" },
    { value: "expense", label: "รายจ่าย" },
]

const TIME_RANGE_OPTIONS = [
    { value: "all", label: "ทุกช่วงเวลา" },
    { value: "today", label: "วันนี้" },
    { value: "7days", label: "7 วันย้อนหลัง" },
    { value: "thismonth", label: "เดือนนี้" },
    { value: "month", label: "เลือกเดือน" },
    { value: "custom", label: "กำหนดเอง" },
]

const SORT_OPTIONS = [
    { value: "date-desc", label: "ใหม่ → เก่า" },
    { value: "date-asc", label: "เก่า → ใหม่" },
    { value: "amount-desc", label: "เงิน มาก → น้อย" },
    { value: "amount-asc", label: "เงิน น้อย → มาก" },
]

const MONTHS = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
]

const SELECT_CLASS =
    "rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

type ExpenseFiltersProps = {
    filters: ExpenseFiltersState
    setFilters: React.Dispatch<
        React.SetStateAction<ExpenseFiltersState>
    >
    DEFAULT_FILTERS: ExpenseFiltersState
}

function ExpenseFilters({
    filters,
    setFilters,
    DEFAULT_FILTERS,
}: ExpenseFiltersProps) {
    const [showTimeRangeMenu, setShowTimeRangeMenu] = useState(false)
    const [showMonthModal, setShowMonthModal] = useState(false)
    const [showCustomModal, setShowCustomModal] = useState(false)

    const [monthYear, setMonthYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth()
    )

    const [customStartDate, setCustomStartDate] = useState("")
    const [customEndDate, setCustomEndDate] = useState("")

    const updateFilter = (
        key: keyof ExpenseFiltersState,
        value: string
    ) => {
        setFilters((prev) => {
            const next = {
                ...prev,
                [key]: value,
            }

            if (key === "timeRange") {
                next.selectedMonth =
                    value === "month" ? prev.selectedMonth : ""

                next.startDate =
                    value === "custom" ? prev.startDate : ""

                next.endDate =
                    value === "custom" ? prev.endDate : ""
            }

            return next
        })
    }

    const handleTimeRangeSelect = (value: string) => {
        setShowTimeRangeMenu(false)

        if (value === "month") {
            if (filters.selectedMonth) {
                const [year, month] = filters.selectedMonth.split("-")

                setMonthYear(Number(year))
                setSelectedMonth(Number(month) - 1)
            } else {
                setMonthYear(new Date().getFullYear())
                setSelectedMonth(new Date().getMonth())
            }

            setShowMonthModal(true)
            return
        }

        if (value === "custom") {
            setCustomStartDate(filters.startDate)
            setCustomEndDate(filters.endDate)
            setShowCustomModal(true)
            return
        }

        updateFilter("timeRange", value)
    }

    const handleMonthConfirm = () => {
        const month = String(selectedMonth + 1).padStart(2, "0")

        setFilters((prev) => ({
            ...prev,
            timeRange: "month",
            selectedMonth: `${monthYear}-${month}`,
            startDate: "",
            endDate: "",
        }))

        setShowMonthModal(false)
    }

    const handleCustomConfirm = () => {
        if (!customStartDate || !customEndDate) return
        if (customStartDate > customEndDate) return

        setFilters((prev) => ({
            ...prev,
            timeRange: "custom",
            selectedMonth: "",
            startDate: customStartDate,
            endDate: customEndDate,
        }))

        setShowCustomModal(false)
    }

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS)
    }

    const hasActiveFilters = Object.entries(DEFAULT_FILTERS).some(
        ([key, value]) =>
            filters[key as keyof ExpenseFiltersState] !== value
    )

    const formatSelectedMonth = () => {
        if (!filters.selectedMonth) return "เลือกเดือน"

        const [year, month] = filters.selectedMonth.split("-")

        return `${MONTHS[Number(month) - 1]} ${Number(year) + 543}`
    }

    const formatDate = (date: string) => {
        if (!date) return ""

        const [year, month, day] = date.split("-")

        return `${day}/${month}/${Number(year) + 543}`
    }

    const getCustomLabel = () => {
        if (!filters.startDate || !filters.endDate) {
            return "กำหนดเอง"
        }

        return `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
    }

    const getTimeRangeLabel = () => {
        if (filters.timeRange === "month") {
            return `ช่วงเวลา: ${formatSelectedMonth()}`
        }

        if (filters.timeRange === "custom") {
            return `ช่วงเวลา: ${getCustomLabel()}`
        }

        return (
            TIME_RANGE_OPTIONS.find(
                (option) => option.value === filters.timeRange
            )?.label ?? "ทุกช่วงเวลา"
        )
    }

    useEffect(() => {
        if (
            !showTimeRangeMenu &&
            !showMonthModal &&
            !showCustomModal
        ) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowTimeRangeMenu(false)
                setShowMonthModal(false)
                setShowCustomModal(false)
            }
        }

        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [
        showTimeRangeMenu,
        showMonthModal,
        showCustomModal,
    ])

    return (
        <>
            <div className="rounded-card border border-line bg-surface p-3 shadow-card">

                {/* Search */}
                <div className="relative">
                    <FiSearch
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                        size={15}
                    />

                    <input
                        type="search"
                        placeholder="ค้นหาหมวดหมู่หรือโน้ต..."
                        value={filters.search}
                        onChange={(e) =>
                            updateFilter("search", e.target.value)
                        }
                        className="w-full rounded-lg border border-line bg-paper py-1.5 pl-8 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">

                    {/* Type */}
                    <div
                        className="inline-flex rounded-lg border border-line bg-paper p-0.5"
                        role="group"
                        aria-label="ประเภทรายการ"
                    >
                        {EXPENSE_TYPE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    updateFilter(
                                        "type",
                                        option.value
                                    )
                                }
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                    filters.type === option.value
                                        ? "bg-ink text-white"
                                        : "text-muted hover:text-ink"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Category */}
                    <select
                        aria-label="หมวดหมู่"
                        value={filters.category}
                        onChange={(e) =>
                            updateFilter(
                                "category",
                                e.target.value
                            )
                        }
                        className={SELECT_CLASS}
                    >
                        <option value="all">
                            ทุกหมวดหมู่
                        </option>

                        {CATEGORIES.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {CATEGORY_LABELS[category]}
                            </option>
                        ))}
                    </select>

                    {/* Time Range */}
                    <div className="relative">
                        <button
                            type="button"
                            aria-label="ช่วงเวลา"
                            onClick={() =>
                                setShowTimeRangeMenu(
                                    (prev) => !prev
                                )
                            }
                            className={`${SELECT_CLASS} flex items-center gap-1`}
                        >
                            <span>
                                {getTimeRangeLabel()}
                            </span>

                            <FiChevronDown
                                size={14}
                                className={`transition-transform ${
                                    showTimeRangeMenu
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {showTimeRangeMenu && (
                            <div className="absolute left-0 top-full z-40 mt-1 min-w-full overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lg">
                                {TIME_RANGE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            handleTimeRangeSelect(
                                                option.value
                                            )
                                        }
                                        className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-xs transition ${
                                            filters.timeRange ===
                                            option.value
                                                ? "bg-paper text-ink"
                                                : "text-muted hover:bg-paper hover:text-ink"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        aria-label="เรียงลำดับ"
                        value={filters.sort}
                        onChange={(e) =>
                            updateFilter(
                                "sort",
                                e.target.value
                            )
                        }
                        className={SELECT_CLASS}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Reset */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="ml-auto text-xs text-muted transition hover:text-ink"
                        >
                            ล้างตัวกรอง
                        </button>
                    )}
                </div>
            </div>

            {/* Month Modal */}
            {showMonthModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowMonthModal(false)
                        }
                    }}
                >
                    <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-ink">
                                เลือกเดือน
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMonthModal(false)
                                }
                                className="rounded-lg p-1.5 text-muted hover:bg-paper hover:text-ink"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    setMonthYear(
                                        (year) => year - 1
                                    )
                                }
                                className="rounded-lg p-2 text-muted hover:bg-paper hover:text-ink"
                            >
                                <FiChevronLeft size={18} />
                            </button>

                            <span className="text-sm font-semibold text-ink">
                                {monthYear + 543}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setMonthYear(
                                        (year) => year + 1
                                    )
                                }
                                className="rounded-lg p-2 text-muted hover:bg-paper hover:text-ink"
                            >
                                <FiChevronRight size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((month, index) => (
                                <button
                                    key={month}
                                    type="button"
                                    onClick={() =>
                                        setSelectedMonth(index)
                                    }
                                    className={`rounded-lg px-3 py-2 text-sm transition ${
                                        selectedMonth === index
                                            ? "bg-ink text-white"
                                            : "text-ink hover:bg-paper"
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleMonthConfirm}
                            className="mt-5 w-full rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            ใช้ช่วงเวลานี้
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Modal */}
            {showCustomModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCustomModal(false)
                        }
                    }}
                >
                    <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-ink">
                                กำหนดช่วงเวลา
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCustomModal(false)
                                }
                                className="rounded-lg p-1.5 text-muted hover:bg-paper hover:text-ink"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div>
                                <label className="mb-1.5 block text-xs text-muted">
                                    วันที่เริ่มต้น
                                </label>

                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) =>
                                        setCustomStartDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs text-muted">
                                    วันที่สิ้นสุด
                                </label>

                                <input
                                    type="date"
                                    value={customEndDate}
                                    min={
                                        customStartDate ||
                                        undefined
                                    }
                                    onChange={(e) =>
                                        setCustomEndDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                        </div>

                        <button
                            type="button"
                            disabled={
                                !customStartDate ||
                                !customEndDate
                            }
                            onClick={handleCustomConfirm}
                            className="mt-5 w-full rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ใช้ช่วงเวลานี้
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ExpenseFilters