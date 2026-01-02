import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SendIconProps {
  size?: number;
  color?: string;
}

export default function SendIcon({ size = 24, color = '#000' }: SendIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
