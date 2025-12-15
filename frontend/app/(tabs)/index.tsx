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
import { Lightbulb } from 'lucide-react-native';
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
    likes: 363,
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
      { id: '1', text: 'Passion', percentage: 55 },
      { id: '2', text: 'Family', percentage: 45 },
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
      { id: '1', text: 'Technical Glitches', percentage: 0 },
      { id: '2', text: 'Forgetting Your Lines', percentage: 0 },
      { id: '3', text: "Questions You Can't Answer", percentage: 0 },
    ],
    likes: 245,
    hasVoted: false,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.logoHeader}>
        <Image
          source={require('../../assets/images/ican.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <Lightbulb size={28} color="#45BFD0" />
        <Text style={styles.headerTitle}>Thoughts</Text>
      </View>

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
    backgroundColor: '#F8F9FA',
  },
  logoHeader: {
    paddingTop: 30,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 50,
    height: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
