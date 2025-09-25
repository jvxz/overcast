import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  `${interactiveStyles.base} relative inline-flex items-center justify-center`,
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: interactiveStyles.size.default,
        icon: interactiveStyles.size.icon,
        lg: interactiveStyles.size.lg,
        sm: interactiveStyles.size.sm,
      },
      variant: {
        danger: interactiveStyles.variant.danger,
        default: interactiveStyles.variant.default,
        ghost: interactiveStyles.variant.ghost,
        link: interactiveStyles.variant.link,
        outline: interactiveStyles.variant.outline,
        soft: interactiveStyles.variant.soft,
      },
    },
  },
)

export const badgeVariants = cva(
  `${interactiveStyles.base} inline-flex w-fit shrink-0 cursor-default items-center justify-center px-2 py-0.5 text-xs tracking-wide select-none`,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        danger: `${interactiveStyles.variant.danger}`,
        default: `${interactiveStyles.variant.default}`,
        ghost: `${interactiveStyles.variant.ghost}`,
        outline: `${interactiveStyles.variant.outline}`,
      },
    },
  },
)

export const avatarVariant = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden bg-secondary font-normal text-foreground select-none',
  {
    variants: {
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
      size: {
        base: 'h-16 w-16 text-2xl',
        lg: 'h-32 w-32 text-5xl',
        sm: 'h-10 w-10 text-xs',
      },
    },
  },
)
export type AvatarVariants = VariantProps<typeof avatarVariant>

export const alertVariants = cva(
  `${staticStyles.base} relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 py-3 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-1 [&>svg]:text-foreground`,
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        danger: `${staticStyles.variant.danger} bg-danger/40 text-danger-foreground`,
        default: staticStyles.variant.default,
      },
    },
  },
)
export type AlertVariants = VariantProps<typeof alertVariants>
