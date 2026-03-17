import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-12 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-[#2563EB]/10 p-4">
          <Icon className="h-8 w-8 text-[#2563EB]" />
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-[#2563EB]">{title}</h3>
      {description && <p className="mb-4 max-w-md text-sm text-gray-500">{description}</p>}
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}><Button variant="secondary">{actionLabel}</Button></a>
        ) : (
          <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
