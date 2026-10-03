import React from 'react';

interface KfeClearBoxIconProps {
  className?: string;
}

export const KfeClearBoxIcon: React.FC<KfeClearBoxIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer scalloped certificate seal ring */}
      <path
        d="M12 2l2.4 2.2 3.2-.6 1.4 2.9 3.1 1.1-.3 3.3 2.2 2.4-2.2 2.4.3 3.3-3.1 1.1-1.4 2.9-3.2-.6L12 22l-2.4-2.2-3.2.6-1.4-2.9-3.1-1.1.3-3.3-2.2-2.4 2.2-2.4-.3-3.3 3.1-1.1 1.4-2.9 3.2.6L12 2z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
      />
      {/* Inner verification check shield */}
      <path d="M9 12l2 2 4-4" strokeWidth="2.2" />
    </svg>
  );
};
