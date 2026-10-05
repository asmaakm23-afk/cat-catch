import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. FISH SVG: Cute blue/pink fish with fins and eye
export const FishIcon: React.FC<IconProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail fin */}
      <path
        d="M6 14C10 18 10 22 6 26C12 24 14 20 14 20C14 20 12 16 6 14Z"
        fill="#8DB9DE"
        stroke="#805B46"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Dorsal fin */}
      <path
        d="M20 12C24 9 27 10 29 13"
        stroke="#F2A7C3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Main body */}
      <path
        d="M12 20C12 13 22 11 32 18C35 20 35 20 32 22C22 29 12 27 12 20Z"
        fill="#8DB9DE"
        stroke="#805B46"
        strokeWidth="2"
      />
      {/* Belly highlight */}
      <path
        d="M16 23C20 25 26 25 30 21"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="28" cy="18" r="2.2" fill="#805B46" />
      <circle cx="28.7" cy="17.3" r="0.8" fill="#FFFFFF" />
      {/* Gill curve */}
      <path
        d="M24 17C23 19 23 21 24 23"
        stroke="#F2A7C3"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 2. MOUSE SVG: Round grey mouse with large pink ears and countdown ring
interface MouseIconProps extends IconProps {
  progress?: number; // 0 to 1 (1 = full time, 0 = expiring)
  secondsLeft?: number;
}

export const MouseIcon: React.FC<MouseIconProps> = ({
  className = '',
  size = 28,
  progress = 1,
  secondsLeft,
}) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Circular timer ring */}
      <svg
        className="absolute inset-0 -rotate-90 pointer-events-none"
        width={size}
        height={size}
        viewBox="0 0 44 44"
      >
        {/* Background track */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#F2A7C3"
          strokeOpacity="0.25"
          strokeWidth="2.5"
        />
        {/* Animated active progress */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={progress < 0.3 ? '#E05375' : '#F2A7C3'}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      {/* Mouse character */}
      <svg
        width={size * 0.8}
        height={size * 0.8}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail */}
        <path
          d="M7 26C4 28 3 32 6 34"
          stroke="#F2A7C3"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Left ear */}
        <circle cx="12" cy="11" r="5" fill="#8A8F98" stroke="#805B46" strokeWidth="1.4" />
        <circle cx="12" cy="11" r="2.8" fill="#F2A7C3" />
        {/* Right ear */}
        <circle cx="24" cy="11" r="5" fill="#8A8F98" stroke="#805B46" strokeWidth="1.4" />
        <circle cx="24" cy="11" r="2.8" fill="#F2A7C3" />
        {/* Body */}
        <ellipse cx="18" cy="21" rx="10" ry="8.5" fill="#8A8F98" stroke="#805B46" strokeWidth="1.6" />
        {/* Cute face */}
        {/* Eyes */}
        <circle cx="15" cy="19" r="1.3" fill="#805B46" />
        <circle cx="21" cy="19" r="1.3" fill="#805B46" />
        {/* Pink nose */}
        <path d="M17 23L19 23L18 24.5Z" fill="#F2A7C3" />
        {/* Whiskers */}
        <line x1="11" y1="22" x2="6" y2="21" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="11" y1="23" x2="6" y2="24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="22" x2="30" y2="21" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="23" x2="30" y2="24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Tiny seconds badge if tight on time */}
      {secondsLeft !== undefined && secondsLeft <= 3 && (
        <span className="absolute -top-1 -right-1 bg-[#F2A7C3] text-white font-bold text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none border border-white">
          {secondsLeft}
        </span>
      )}
    </div>
  );
};

// 3. DOG SVG: Stationary hazard with floppy ears and friendly mischievous face
interface DogIconProps extends IconProps {
  progress?: number; // 0 to 1 for remaining 10s
}

export const DogIcon: React.FC<DogIconProps> = ({ className = '', size = 28, progress }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Floppy Left Ear */}
        <path
          d="M8 15C6 9 12 7 14 11C12 17 9 21 8 15Z"
          fill="#805B46"
          stroke="#5C3D2E"
          strokeWidth="1.5"
        />
        {/* Floppy Right Ear */}
        <path
          d="M32 15C34 9 28 7 26 11C28 17 31 21 32 15Z"
          fill="#805B46"
          stroke="#5C3D2E"
          strokeWidth="1.5"
        />
        {/* Head */}
        <ellipse cx="20" cy="20" rx="12" ry="11" fill="#D2A379" stroke="#805B46" strokeWidth="1.8" />
        {/* Muzzle */}
        <ellipse cx="20" cy="24" rx="6.5" ry="4.5" fill="#F5EBDD" />
        {/* Nose */}
        <ellipse cx="20" cy="22.5" rx="2.5" ry="1.8" fill="#805B46" />
        {/* Tongue sticking out playfully */}
        <path
          d="M19 26C19 28.5 21 28.5 21 26Z"
          fill="#F2A7C3"
          stroke="#805B46"
          strokeWidth="1"
        />
        {/* Eyes */}
        <circle cx="15.5" cy="17.5" r="1.8" fill="#805B46" />
        <circle cx="16" cy="17" r="0.6" fill="#FFFFFF" />
        <circle cx="24.5" cy="17.5" r="1.8" fill="#805B46" />
        <circle cx="25" cy="17" r="0.6" fill="#FFFFFF" />
        {/* Eyebrows */}
        <path d="M14 14C15 13 17 13.5 17.5 14" stroke="#805B46" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M26 14C25 13 23 13.5 22.5 14" stroke="#805B46" strokeWidth="1.2" strokeLinecap="round" />
        {/* Collar tag badge */}
        <circle cx="20" cy="31" r="2.2" fill="#F2A7C3" stroke="#805B46" strokeWidth="1" />
      </svg>
      {/* Subdued warning / countdown border if timer active */}
      {progress !== undefined && progress < 0.3 && (
        <span className="absolute -bottom-1 text-[8px] font-bold text-[#805B46] bg-white/90 px-1 rounded-full border border-[#805B46]/30">
          !
        </span>
      )}
    </div>
  );
};

// 4. MILK SVG: Cozy bottle / bowl of milk with blue shimmer
interface MilkIconProps extends IconProps {
  progress?: number;
}

export const MilkIcon: React.FC<MilkIconProps> = ({ className = '', size = 28, progress = 1 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Bottle neck & cap */}
        <rect x="15" y="6" width="6" height="3" rx="1.5" fill="#8DB9DE" stroke="#805B46" strokeWidth="1.2" />
        <path d="M14 9H22L24 14H12L14 9Z" fill="#FFFFFF" stroke="#805B46" strokeWidth="1.2" />
        {/* Bottle body */}
        <rect x="11" y="14" width="14" height="16" rx="4" fill="#FFFFFF" stroke="#805B46" strokeWidth="1.6" />
        {/* Milk liquid fill */}
        <rect x="12" y="18" width="12" height="11" rx="2" fill="#EAF3FA" />
        {/* Pink heart or milk drop emblem */}
        <path
          d="M18 20.5C18 20.5 15.5 22.5 15.5 24C15.5 25.4 16.6 26.5 18 26.5C19.4 26.5 20.5 25.4 20.5 24C20.5 22.5 18 20.5 18 20.5Z"
          fill="#8DB9DE"
        />
        {/* Glass shine highlight */}
        <line x1="13.5" y1="16" x2="13.5" y2="26" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {/* Soft blue sparkle halo */}
      <span className="absolute inset-0 rounded-full border border-[#8DB9DE]/40 animate-pulse pointer-events-none" />
    </div>
  );
};

// 5. PAW WARNING INDICATOR: Pulsing paw print before dog spawns
export const PawWarningIcon: React.FC<IconProps> = ({ className = '', size = 28 }) => {
  return (
    <div
      className={`flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main pad */}
        <ellipse cx="16" cy="20" rx="6.5" ry="5" fill="#F2A7C3" />
        {/* 4 toe pads */}
        <ellipse cx="9" cy="13" rx="2.5" ry="3.2" transform="rotate(-15 9 13)" fill="#F2A7C3" />
        <ellipse cx="13.5" cy="9.5" rx="2.4" ry="3.4" fill="#F2A7C3" />
        <ellipse cx="18.5" cy="9.5" rx="2.4" ry="3.4" fill="#F2A7C3" />
        <ellipse cx="23" cy="13" rx="2.5" ry="3.2" transform="rotate(15 23 13)" fill="#F2A7C3" />
      </svg>
    </div>
  );
};

// 6. SHIELD BADGE / ICON
export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L4 5V11C4 16.5 7.4 21.6 12 23C16.6 21.6 20 16.5 20 11V5L12 2Z"
        fill="#8DB9DE"
        stroke="#805B46"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 6V18M8 10L12 6L16 10"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
