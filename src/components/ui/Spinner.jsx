const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
}

export default function Spinner({ size = 'md' }) {
  return (
    <div className={`${sizes[size] || sizes.md} border-[#2563EB] border-t-transparent rounded-full animate-spin`} />
  )
}
