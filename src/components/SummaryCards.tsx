function SummaryCards() {
  return (
    <div className='grid gap-4 grid-cols-3'>
      <div className='rounded-2xl border-line bg-white/60 p-5'>
        <h2 className='text-sm text-ink/70'>รายรับ</h2>
        <p className='mt-1 font-mono text-xl font-medium text-sage'>฿100,000</p>
      </div>
      <div className='rounded-2xl border-line bg-white/60 p-5'>
        <h2 className='text-sm text-ink/70'>รายจ่าย</h2>
        <p className='mt-1 font-mono text-xl font-medium text-sage'>฿100,000</p>
      </div>
      <div className='rounded-2xl border-line bg-white/60 p-5'>
        <h2 className='text-sm text-ink/70'>คงเหลือ</h2>
        <p className='mt-1 font-mono text-xl font-medium text-sage'>฿100,000</p>
      </div>
    </div>
  )
}

export default SummaryCards
