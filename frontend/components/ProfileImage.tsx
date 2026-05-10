import React, { useState, useCallback } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Animated,
    ViewStyle,
    ImageStyle,
} from 'react-native';
import { getProfileImageUrl } from '@/utils/profileImageUtils';

interface ProfileImageProps {
    /** Profile picture URL/path from the backend */
    uri?: string | null;
    /** Size of the image (width and height) */
    size?: number;
    /** Border width around the image */
    borderWidth?: number;
    /** Border color around the image */
    borderColor?: string;
    /** Additional styles for the container */
    style?: ViewStyle;
    /** Additional styles for the image */
    imageStyle?: ImageStyle;
}

/**
 * ProfileImage Component
 * 
 * A reusable profile image component with:
 * - Shimmer/pulse loading animation while image loads
 * - Smooth fade-in when the image is ready
 * - Automatic URL resolution via profileImageUtils
 * - Graceful fallback on error
 */
export default function ProfileImage({
    uri,
    size = 80,
    borderWidth = 0,
    borderColor = '#458FD0',
    style,
    imageStyle,
}: ProfileImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Animated values
    const [fadeAnim] = useState(new Animated.Value(0));
    const [pulseAnim] = useState(new Animated.Value(0.4));

    // Start pulse animation on mount
    React.useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        if (isLoading) {
            pulse.start();
        }

        return () => pulse.stop();
    }, [isLoading]);

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
        // Fade in the image
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoading(false);
        // Still fade in (will show fallback)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const resolvedUri = getProfileImageUrl(hasError ? null : uri);
    const borderRadius = size / 2;

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius,
                    borderWidth,
                    borderColor,
                },
                style,
            ]}
        >
            {/* Shimmer/Pulse placeholder (visible while loading) */}
            {isLoading && (
                <Animated.View
                    style={[
                        styles.shimmer,
                        {
                            width: size,
                            height: size,
                            borderRadius,
                            opacity: pulseAnim,
                        },
                    ]}
                >
                    {/* User silhouette icon */}
                    <View style={[styles.silhouette, { width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, marginTop: size * 0.15 }]} />
                    <View style={[styles.silhouetteBody, { width: size * 0.6, height: size * 0.3, borderTopLeftRadius: size * 0.3, borderTopRightRadius: size * 0.3 }]} />
                </Animated.View>
            )}

            {/* Actual image (fades in when loaded) */}
            <Animated.Image
                source={{ uri: resolvedUri }}
                style={[
                    styles.image,
                    {
                        width: size - borderWidth * 2,
                        height: size - borderWidth * 2,
                        borderRadius: (size - borderWidth * 2) / 2,
                        opacity: fadeAnim,
                    },
                    imageStyle,
                ]}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8ECF0',
    },
    shimmer: {
        position: 'absolute',
        backgroundColor: '#D0D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    silhouette: {
        backgroundColor: '#BCC3CB',
    },
    silhouetteBody: {
        backgroundColor: '#BCC3CB',
        marginTop: 4,
    },
    image: {
        position: 'absolute',
    },
});
