import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { authStorage } from '@/utils/authStorage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'The human brain generates an estimated',
    subtitle: '6,000 to 70,000 thoughts per day',
  },
  {
    title: 'A snapshot of billion thoughts',
    subtitle: '',
  },
  {
    title: 'Welcome to Thoughts',
    subtitle: '',
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const pan = useRef(new Animated.Value(0)).current;

  // Create PanResponder to handle swipes across the entire screen
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only claim if horizontal movement is significant
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const SWIPE_THRESHOLD = 50;
        setCurrentPage(prev => {
          if (gestureState.dx < -SWIPE_THRESHOLD && prev < onboardingData.length - 1) {
            return prev + 1;
          } else if (gestureState.dx > SWIPE_THRESHOLD && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        // Reset animation
        Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
      },
    })
  ).current;

  const handleSignUp = async () => {
    // Mark onboarding as completed before navigating
    await authStorage.setOnboardingCompleted();
    router.replace('/auth/signup');
  };

  const isLastPage = currentPage === onboardingData.length - 1;

  return (
    <LinearGradient
      colors={['#07F2DF', '#458FD0']}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{onboardingData[currentPage].title}</Text>
        {onboardingData[currentPage].subtitle ? (
          <Text style={styles.subtitle}>
            {onboardingData[currentPage].subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.ctaSection}>
        {/* CTA Card - Gradient bars */}
        <View style={styles.ctaCard}>
          <LinearGradient
            colors={['#3DD1E0', '#45BFD0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaBar}
          />
          <LinearGradient
            colors={['#45BFD0', '#5DE0EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.ctaBar, styles.ctaBarSecond]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Show Sign Up button only on last page, otherwise show swipe hint */}
        {isLastPage ? (
          <View style={styles.signupContainer}>
            <TouchableOpacity onPress={handleSignUp} style={styles.signupButton}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe to continue</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0,
  },
  ctaSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  ctaCard: {
    gap: 12,
  },
  ctaBar: {
    height: 12,
    borderRadius: 6,
    width: '100%',
  },
  ctaBarSecond: {
    width: '70%',
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    // Ensure footer doesn't block gestures but buttons are clickable
    zIndex: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
  signupContainer: {
    alignItems: 'center',
    width: '100%',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32, // Matched previous 'nextButton' style
    paddingVertical: 12,   // Matched previous 'nextButton' style
    borderRadius: 8,
  },
  signupText: {
    color: '#45BFD0',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
  swipeHint: {
    alignItems: 'center',
    height: 44, // Placeholder height to prevent layout jump
    justifyContent: 'center',
  },
  swipeHintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
});
