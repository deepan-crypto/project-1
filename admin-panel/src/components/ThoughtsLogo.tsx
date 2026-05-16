interface ThoughtsLogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export default function ThoughtsLogo({ size = 40, showText = true, textClassName = '' }: ThoughtsLogoProps) {
  const gradientId = `thoughts-grad-${size}`;
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(179, 105) scale(9.1)">
          <path
            d="M42.3355 91.4999C43.8355 72.4999 45.8355 40.5 38.8355 33.5C31.8355 26.5 11.1273 41.1744 4.33557 35C-1.16442 30 10.3202 3.00001 38.8355 3C60.8356 2.99999 69.8355 20 69.8355 32C69.8355 49.2627 56.8355 59 44.0874 61C19.8355 64.8048 13.8355 48 12.8355 46"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <linearGradient id={gradientId} x1="36.4183" y1="2.97708" x2="36.4183" y2="91.4999" gradientUnits="userSpaceOnUse">
            <stop stopColor="#458FD0" />
            <stop offset="1" stopColor="#07F2DF" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className={textClassName || 'text-xl font-bold text-slate-900'}>
          Thoughts
        </span>
      )}
    </div>
  );
}
