import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/auth/signup');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/signup');
  };

  return (
    <LinearGradient colors={['#45BFD0', '#2B9EB3']} style={styles.container}>
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

        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextText: {
    color: '#45BFD0',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
});
