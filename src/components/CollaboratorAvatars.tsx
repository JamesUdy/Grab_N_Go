import type { ListDoc } from '../lib/types'

interface Props {
  list: ListDoc
  max?: number
  size?: 'sm' | 'md'
}

export function CollaboratorAvatars({ list, max = 4, size = 'sm' }: Props) {
  const members = Object.entries(list.members)
  if (members.length <= 1) return null

  const visible = members.slice(0, max)
  const overflow = members.length - max

  const dim = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
  const ring = 'ring-2 ring-[--color-surface]'

  return (
    <div className="flex items-center -space-x-1.5" aria-label={`${members.length} members`}>
      {visible.map(([uid, info]) =>
        info.photoURL ? (
          <img
            key={uid}
            src={info.photoURL}
            alt={info.displayName ?? 'Member'}
            title={info.displayName ?? 'Member'}
            className={`${dim} ${ring} rounded-full object-cover`}
          />
        ) : (
          <span
            key={uid}
            title={info.displayName ?? 'Member'}
            className={`${dim} ${ring} rounded-full bg-[--color-accent]/20 text-[--color-accent] font-bold flex items-center justify-center`}
          >
            {(info.displayName ?? '?')[0].toUpperCase()}
          </span>
        ),
      )}
      {overflow > 0 && (
        <span
          className={`${dim} ${ring} rounded-full bg-[--color-ink]/10 text-[--color-ink]/60 font-bold flex items-center justify-center`}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
