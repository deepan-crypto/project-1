import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import PollCard from '@/components/PollCard';
import API_BASE_URL from '@/config/api';

interface Poll {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  question: string;
  options: {
    id: number;
    text: string;
    percentage: number;
    emoji?: string;
  }[];
  likes: number;
  hasVoted: boolean;
}

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPolls = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/polls`);
      const data = await response.json();

      if (response.ok && data.polls) {
        // Transform API data to match PollCard props
        const transformedPolls = data.polls.map((poll: any) => ({
          id: poll.id,
          user: {
            name: poll.user.name,
            avatar: poll.user.avatar?.startsWith('http')
              ? poll.user.avatar
              : `${API_BASE_URL.replace('/api', '')}${poll.user.avatar}`,
          },
          question: poll.question,
          options: poll.options,
          likes: poll.likes,
          hasVoted: poll.hasVoted,
        }));
        setPolls(transformedPolls);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchPolls();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPolls();
  };

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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#458FD0" />
          <Text style={styles.loadingText}>Loading polls...</Text>
        </View>
      ) : polls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No polls yet</Text>
          <Text style={styles.emptySubtext}>Be the first to create a poll!</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {polls.map((poll) => (
            <PollCard key={poll.id} {...poll} />
          ))}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});


