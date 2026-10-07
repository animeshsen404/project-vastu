import React from 'react';

export interface BrandNameProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero' | 'inherit';
  variant?: 'split' | 'monochrome' | 'reverse';
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'div';
  uppercase?: boolean;
}

const sizeClasses: Record<string, string> = {
  xs: 'text-xs tracking-wider',
  sm: 'text-sm tracking-wider',
  md: 'text-base sm:text-lg tracking-wider',
  lg: 'text-lg sm:text-xl tracking-wide',
  xl: 'text-xl sm:text-2xl tracking-wide',
  '2xl': 'text-2xl sm:text-3xl tracking-wide',
  '3xl': 'text-3xl sm:text-4xl tracking-wide',
  hero: 'text-3xl sm:text-5xl lg:text-6xl tracking-wider',
  inherit: '',
};

/**
 * BrandName Component
 * Canonical brand typography for "Vastu Ritam" matching the brand logo identity:
 * - Font: Cinzel (Classical architectural serif font matching the registered logo)
 * - "Vastu" in Primary Red (#C51E28)
 * - "Ritam" in Secondary Green (#167A68)
 * - Consistent capitalization and spacing everywhere
 */
export const BrandName: React.FC<BrandNameProps> = ({
  className = '',
  size = 'inherit',
  variant = 'split',
  as: Component = 'span',
  uppercase = false,
}) => {
  const sizeClass = sizeClasses[size] || '';
  const vastuText = uppercase ? 'VASTU' : 'Vastu';
  const ritamText = uppercase ? 'RITAM' : 'Ritam';

  if (variant === 'monochrome') {
    return (
      <Component className={`font-['Cinzel',serif] font-bold select-none inline-flex items-baseline ${sizeClass} ${className}`}>
        {vastuText} {ritamText}
      </Component>
    );
  }

  return (
    <Component
      className={`font-['Cinzel',serif] font-bold select-none inline-flex items-baseline flex-nowrap ${sizeClass} ${className}`}
    >
      <span className="text-[var(--color-primary,#C51E28)] transition-colors duration-200">
        {vastuText}
      </span>
      <span className="inline-block w-[0.3em]">&nbsp;</span>
      <span className="text-[var(--color-secondary,#167A68)] transition-colors duration-200">
        {ritamText}
      </span>
    </Component>
  );
};

export default BrandName;
