import { getBrandIcon } from '../../lib/brand-icons';

interface BrandIconProps {
  name: string;
  size?: number;
}

export default function BrandIcon({ name, size = 20 }: BrandIconProps) {
  const icon = getBrandIcon(name);
  if (!icon) return null;

  return (
    <svg
      className="brand-icon"
      data-brand={name}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {icon.paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
