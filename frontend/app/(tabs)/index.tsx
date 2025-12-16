import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import PollCard from '@/components/PollCard';

const mockPolls = [
  {
    id: '1',
    user: {
      name: 'Abigail',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    question: 'Which is the ultimate weekend vibe?',
    options: [
      { id: '1', text: 'Beach time', percentage: 0 },
      { id: '2', text: 'Netflix & Chill', percentage: 0 },
      { id: '3', text: 'Hiking Adventure', percentage: 0 },
    ],
    likes: 363,
    hasVoted: false,
  },
  {
    id: '2',
    user: {
      name: 'Maxj13',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    question: 'Which is the must-watch show of the year?',
    options: [
      { id: '1', text: 'The Last of Us', percentage: 20 },
      { id: '2', text: 'Wednesday', percentage: 80 },
    ],
    likes: 161,
    hasVoted: true,
  },
  {
    id: '3',
    user: {
      name: 'Dani_kj',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    question: 'What motivates you the most?',
    options: [
      { id: '1', text: 'Passion', percentage: 55, emoji: '🔥' },
      { id: '2', text: 'Family', percentage: 45, emoji: '❤️' },
    ],
    likes: 690,
    hasVoted: true,
  },
  {
    id: '4',
    user: {
      name: 'Tabith',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    question: "What's worse during a presentation?",
    options: [
      { id: '1', text: 'Technical Glitches', percentage: 0, emoji: '💻' },
      { id: '2', text: 'Forgetting Your Lines', percentage: 0, emoji: '😅' },
      { id: '3', text: "Questions You Can't Answer", percentage: 0, emoji: '🤔' },
    ],
    likes: 245,
    hasVoted: false,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Logo Header */}
      <View style={styles.logoHeader}>
        <Image
          source={require('../../assets/images/ican.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Poll Feed */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockPolls.map((poll) => (
          <PollCard key={poll.id} {...poll} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoHeader: {
    paddingTop: 40,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    width: 30,
    height: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 100,
  },
});

