import { classNames } from '../../lib/utils'

export default function Card({ title, children, className }) {
  return (
    <div className={classNames('bg-white border border-[#E5E7EB] rounded-xl p-6', className)}>
      {title && (
        <h3 className="text-base font-semibold text-[#111827] mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}
