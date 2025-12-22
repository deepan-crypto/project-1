import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SendIconProps {
    size?: number;
    color?: string;
}

export default function SendIcon({ size = 24, color = '#000000' }: SendIconProps) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            fill={color}
        >
            <Path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
        </Svg>
    );
}
