import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LogoSvgProps {
    width?: number;
    height?: number;
}

export default function LogoSvg({ width = 21, height = 28 }: LogoSvgProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 21 28" fill="none">
            <Path
                d="M12.0938 26.5C12.4977 21.1328 13.0364 12.0932 11.1511 10.1158C9.26592 8.13843 3.68883 12.2837 1.85969 10.5396C0.378447 9.12713 3.47147 1.5 11.1511 1.5C17.0761 1.5 19.5 6.30227 19.5 9.6921C19.5 14.5686 15.9989 17.3192 12.5656 17.8842C6.03409 18.959 4.4182 14.2119 4.14887 13.6469"
                stroke="url(#paint0_linear_logo)"
                strokeWidth={3}
                strokeLinecap="round"
            />
            <Defs>
                <LinearGradient
                    id="paint0_linear_logo"
                    x1="10.5001"
                    y1="1.49353"
                    x2="10.5001"
                    y2="26.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#458FD0" />
                    <Stop offset={1} stopColor="#07F2DF" />
                </LinearGradient>
            </Defs>
        </Svg>
    );
}
