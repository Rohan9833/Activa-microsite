import activaLogo from '../assets/Activabydigilateralwhitebg.png';

/** Official ActiVA logo (raster asset supplied by digiLATERAL). */
export default function Logo({
  variant = 'full',
  className = '',
  eager = false,
}) {
  const dims =
    variant === 'mark'
      ? { width: 640, height: 155 }
      : { width: 720, height: 217 };

  return (
    <img
      src={activaLogo}
      alt="ActiVA — Where Physical Interaction Meets Digital Detailing"
      className={`h-auto ${className}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...dims}
    />
  );
}