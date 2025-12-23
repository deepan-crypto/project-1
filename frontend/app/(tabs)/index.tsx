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
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import PollCard from '@/components/PollCard';
import API_BASE_URL from '@/config/api';
import { authStorage } from '@/utils/authStorage';
import { useSocket } from '@/utils/useSocket';

interface Poll {
  id: string;
  userId?: string;
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
<<<<<<< HEAD
=======
  isLiked?: boolean;
  createdAt?: string;
>>>>>>> master
}

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Socket connection for real-time updates
  const { socket, isConnected } = useSocket();

  // Load current user ID
  useEffect(() => {
    const loadUser = async () => {
      const user = await authStorage.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    loadUser();
  }, []);

  // Listen for real-time poll updates
  useEffect(() => {
    if (!socket) return;

    // Handle like count updates
    const handleLikeUpdate = (data: { pollId: string; likesCount: number }) => {
      console.log('Real-time like update:', data);
      setPolls(prev => prev.map(poll =>
        poll.id === data.pollId ? { ...poll, likes: data.likesCount } : poll
      ));
    };

    // Handle vote/percentage updates
    const handleVoteUpdate = (data: { pollId: string; options: any[] }) => {
      console.log('Real-time vote update:', data);
      setPolls(prev => prev.map(poll =>
        poll.id === data.pollId ? { ...poll, options: data.options } : poll
      ));
    };

    socket.on('poll_like_update', handleLikeUpdate);
    socket.on('poll_vote_update', handleVoteUpdate);

    return () => {
      socket.off('poll_like_update', handleLikeUpdate);
      socket.off('poll_vote_update', handleVoteUpdate);
    };
  }, [socket]);

  const fetchPolls = async () => {
    try {
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/polls`, { headers });
      const data = await response.json();

      if (response.ok && data.polls) {
        // Transform API data to match PollCard props
        const transformedPolls = data.polls.map((poll: any) => ({
          id: poll.id,
          userId: poll.userId,
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
<<<<<<< HEAD
=======
          isLiked: poll.isLiked,
          createdAt: poll.createdAt,
>>>>>>> master
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

  // Handle delete poll
  const handleDeletePoll = async (pollId: string) => {
    Alert.alert(
      'Delete Poll',
      'Are you sure you want to delete this poll?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await authStorage.getToken();
              const response = await fetch(`${API_BASE_URL}/polls/${pollId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                setPolls(polls.filter(p => p.id !== pollId));
                Alert.alert('Success', 'Poll deleted successfully');
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to delete poll');
              }
            } catch (error) {
              console.error('Error deleting poll:', error);
              Alert.alert('Error', 'Network error. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle like poll
  const handleLikePoll = async (pollId: string): Promise<{ likes: number; liked: boolean }> => {
    const token = await authStorage.getToken();
    if (!token) {
      Alert.alert('Error', 'Please log in to like polls');
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { likes: data.likesCount, liked: true };
    } else {
      // If already liked, try to unlike
      if (data.message?.includes('already liked')) {
        const unlikeResponse = await fetch(`${API_BASE_URL}/polls/${pollId}/unlike`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const unlikeData = await unlikeResponse.json();
        return { likes: unlikeData.likesCount, liked: false };
      }
      throw new Error(data.message || 'Failed to like poll');
    }
  };

  // Handle vote on poll
  const handleVotePoll = async (pollId: string, optionIndex: number): Promise<{ options: { id: number; text: string; percentage: number; emoji?: string }[]; hasVoted: boolean }> => {
    const token = await authStorage.getToken();
    if (!token) {
      Alert.alert('Error', 'Please log in to vote');
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionIndex }),
    });

    const data = await response.json();

    if (response.ok && data.options) {
      return {
        options: data.options,
        hasVoted: true
      };
    } else {
      Alert.alert('Error', data.message || 'Failed to vote');
      throw new Error(data.message || 'Failed to vote');
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
            <PollCard
              key={poll.id}
              {...poll}
              onDelete={poll.userId === currentUserId ? handleDeletePoll : undefined}
              onLike={handleLikePoll}
              onVote={handleVotePoll}
            />
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


