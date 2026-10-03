import React from 'react';

interface KfeLogoProps {
  className?: string;
}

export const KfeLogo: React.FC<KfeLogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="kfeShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="kfeInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
      </defs>

      {/* Main Shield Outline */}
      <path
        d="M24 4L7 11V22C7 33.2 14.3 43.6 24 46C33.7 43.6 41 33.2 41 22V11L24 4Z"
        fill="url(#kfeShieldGrad)"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />

      {/* Inner Shield Inset */}
      <path
        d="M24 8L11 13.5V22C11 30.5 16.5 38.3 24 41.5C31.5 38.3 37 30.5 37 22V13.5L24 8Z"
        fill="url(#kfeInnerGrad)"
        stroke="#fef3c7"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Stylized Sunburst / Beacon of Civic Empowerment */}
      <circle cx="24" cy="20" r="5" fill="#fbbf24" />
      <path
        d="M24 11V13M24 27V29M15 20H17M31 20H33M17.6 13.6L19 15M29 25L30.4 26.4M17.6 26.4L19 25M29 15L30.4 13.6"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Open Book / Constitution Foundation at the Base */}
      <path
        d="M17 33C19.5 31.8 22 32 24 33.2C26 32 28.5 31.8 31 33V27C28.5 25.8 26 26 24 27.2C22 26 19.5 25.8 17 27V33Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="0.8"
      />

      {/* Center Spine */}
      <line x1="24" y1="27.2" x2="24" y2="33.2" stroke="#64748b" strokeWidth="0.8" />
    </svg>
  );
};
