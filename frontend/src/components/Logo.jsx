/** Official ActiVA logo (raster asset supplied by digiLATERAL). */
export default function Logo({ variant = 'full', className = '', eager = false }) {
  const root = `${import.meta.env.BASE_URL}assets/`;
  const base = variant === 'mark' ? `${root}activa-logo-mark` : `${root}activa-logo`;
  const dims = variant === 'mark' ? { width: 640, height: 155 } : { width: 720, height: 217 };
  return (
    <picture>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={`${base}.png`}
        alt="ActiVA — Where Physical Interaction Meets Digital Detailing"
        className={`h-auto ${className}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...dims}
      />
    </picture>
  );
}
