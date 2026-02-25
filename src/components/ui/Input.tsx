import { type InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const inputVariants = cva(
  'w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        bordered:
          'rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400',
        underline: 'border-b border-slate-200 py-1 focus:border-indigo-400',
        ghost: 'rounded px-1 focus:bg-slate-50',
      },
    },
    defaultVariants: {
      variant: 'bordered',
    },
  }
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'bordered', className, ...props }, ref) => {
    return <input ref={ref} className={cn(inputVariants({ variant }), className)} {...props} />;
  }
);
Input.displayName = 'Input';
