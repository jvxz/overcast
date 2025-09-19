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
        default: interactiveStyles.variant.default,
        danger: interactiveStyles.variant.danger,
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
        default: `${interactiveStyles.variant.default}`,
        danger: `${interactiveStyles.variant.danger}`,
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
