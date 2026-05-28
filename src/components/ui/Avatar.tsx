import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  src?: string;
  initials?: string;
  showIndicator?: boolean;
}

export function Avatar({ size = 'md', src, initials, showIndicator = false, className = '', ...props }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-[28px] h-[28px] text-[11px]',
    md: 'w-[36px] h-[36px] text-[13px]',
    lg: 'w-[48px] h-[48px] text-[16px]',
    xl: 'w-[64px] h-[64px] text-[20px]'
  };

  const indicatorSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const showImg = src && !imgError;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${sizeClasses[size]} ${className}`} {...props}>
      {showImg ? (
        <img
          src={src}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover border border-border"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-ink-100 text-ink-500 font-semibold flex items-center justify-center border border-border">
          {initials || '?'}
        </div>
      )}

      {showIndicator && (
        <div
          className={`absolute bottom-0 right-0 rounded-full bg-emerald border-2 border-white ${indicatorSize[size]}`}
        />
      )}
    </div>
  );
}
