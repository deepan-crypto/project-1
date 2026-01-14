import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Heart, ArrowRight, Trash2, Settings } from 'lucide-react-native';
import SendIcon from '@/components/SendIcon';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';
import { getProfileImageUrl as getProfileImage } from '@/utils/profileImageUtils';

interface UserPoll {
  id: string;
  question: string;
  options: { text: string; percentage: number }[];
  likes: number;
  hasVoted: boolean;
  isLiked?: boolean;
  votedOptionIndex?: number;
  createdAt: string;
  user?: {
    name: string;
    fullName?: string;
    avatar: string;
  };
}

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [polls, setPolls] = useState<UserPoll[]>([]);
  const [votedPolls, setVotedPolls] = useState<UserPoll[]>([]);
  const [allPolls, setAllPolls] = useState<(UserPoll & { isOwn: boolean })[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [loadingVotedPolls, setLoadingVotedPolls] = useState(true);
  const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });

  // Fetch user stats from API
  const fetchUserStats = async (userId: string) => {
    try {
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, { headers });
      const data = await response.json();
      if (response.ok && data.stats) {
        setStats({
          followersCount: data.stats.followersCount || 0,
          followingCount: data.stats.followingCount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Load user data from storage
  const loadUserData = useCallback(async () => {
    try {
      const userData = await authStorage.getUser();
      console.log('Loaded user data:', userData);
      if (userData) {
        setUser(userData);
        // Fetch user's polls, voted polls, and stats
        fetchUserPolls(userData.id);
        fetchVotedPolls(userData.id);
        fetchUserStats(userData.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Fetch user's polls from API
  const fetchUserPolls = async (userId: string) => {
    console.log('===== FETCHING USER POLLS =====', userId);
    try {
      setLoadingPolls(true);
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      console.log('Fetching user polls from:', `${API_BASE_URL}/polls/user/${userId}`);
      const response = await fetch(`${API_BASE_URL}/polls/user/${userId}`, { headers });
      const data = await response.json();

      console.log('User polls response status:', response.status);
      console.log('User polls data:', JSON.stringify(data, null, 2));

      if (response.ok && data.polls) {
        console.log('Number of user polls received:', data.polls.length);
        setPolls(data.polls);
      } else {
        console.error('Failed to fetch user polls:', data);
      }
    } catch (error) {
      console.error('Error fetching user polls:', error);
    } finally {
      setLoadingPolls(false);
    }
  };

  // Fetch polls the user has voted on
  const fetchVotedPolls = async (userId: string) => {
    console.log('===== FETCHING VOTED POLLS =====', userId);
    try {
      setLoadingVotedPolls(true);
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      console.log('Fetching voted polls from:', `${API_BASE_URL}/polls/user/${userId}/voted`);
      const response = await fetch(`${API_BASE_URL}/polls/user/${userId}/voted`, { headers });
      const data = await response.json();

      console.log('Voted polls response status:', response.status);
      console.log('Voted polls data:', JSON.stringify(data, null, 2));

      if (response.ok && data.polls) {
        console.log('Number of voted polls received:', data.polls.length);
        setVotedPolls(data.polls);
      } else {
        console.error('Failed to fetch voted polls:', data);
      }
    } catch (error) {
      console.error('Error fetching voted polls:', error);
    } finally {
      setLoadingVotedPolls(false);
    }
  };

  // Combine polls whenever either polls or votedPolls changes
  useEffect(() => {
    // Only combine if both have finished loading
    if (!loadingPolls && !loadingVotedPolls) {
      combinePolls(polls, votedPolls);
    }
  }, [polls, votedPolls, loadingPolls, loadingVotedPolls]);

  // Combine own polls and voted polls into single array
  const combinePolls = (ownPolls: UserPoll[], voted: UserPoll[]) => {
    console.log('===== COMBINING POLLS =====');
    console.log('Own polls:', ownPolls.length, ownPolls.map(p => ({ id: p.id, question: p.question })));
    console.log('Voted polls:', voted.length, voted.map(p => ({ id: p.id, question: p.question, userName: p.user?.name })));

    // Use a Map to deduplicate polls by ID
    const pollMap = new Map<string, UserPoll & { isOwn: boolean }>();

    // Add own polls first (they take priority)
    ownPolls.forEach(poll => {
      pollMap.set(poll.id, { ...poll, isOwn: true });
    });

    // Add voted polls only if they're not already in the map
    voted.forEach(poll => {
      if (!pollMap.has(poll.id)) {
        pollMap.set(poll.id, { ...poll, isOwn: false });
      }
    });

    // Convert Map to array and sort by creation date, newest first
    const combined = Array.from(pollMap.values());
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('Combined polls:', combined.length);
    console.log('Poll details:', combined.map(p => ({
      id: p.id,
      question: p.question,
      isOwn: p.isOwn,
      hasVoted: p.hasVoted,
      votedOptionIndex: p.votedOptionIndex
    })));

    setAllPolls(combined);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Load on mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Reload when screen comes into focus (after editing profile)
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleShareProfile = async () => {
    try {
      const profileUrl = `myapp://profile/${user?.username || 'user'}`;
      await Share.share({
        message: `Check out my profile on the app!\n\n${profileUrl}`,
        title: 'Share Profile',
        url: profileUrl, // iOS uses this
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  // Get profile image URL (handle relative paths)
  const getProfileImageUrl = () => getProfileImage(user?.profilePicture);

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
                // Remove from local state
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
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      // Update poll in all states
      setPolls(polls.map(p =>
        p.id === pollId ? { ...p, likes: data.likesCount, isLiked: true } : p
      ));
      setVotedPolls(votedPolls.map(p =>
        p.id === pollId ? { ...p, likes: data.likesCount, isLiked: true } : p
      ));
      setAllPolls(allPolls.map(p =>
        p.id === pollId ? { ...p, likes: data.likesCount, isLiked: true } : p
      ));
      return { likes: data.likesCount, liked: true };
    } else {
      // If already liked, try to unlike
      if (data.message?.includes('already liked')) {
        const unlikeResponse = await fetch(`${API_BASE_URL}/polls/${pollId}/unlike`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const unlikeData = await unlikeResponse.json();
        if (unlikeResponse.ok) {
          setPolls(polls.map(p =>
            p.id === pollId ? { ...p, likes: unlikeData.likesCount, isLiked: false } : p
          ));
          setVotedPolls(votedPolls.map(p =>
            p.id === pollId ? { ...p, likes: unlikeData.likesCount, isLiked: false } : p
          ));
          setAllPolls(allPolls.map(p =>
            p.id === pollId ? { ...p, likes: unlikeData.likesCount, isLiked: false } : p
          ));
          return { likes: unlikeData.likesCount, liked: false };
        }
      }
      throw new Error(data.message || 'Failed to like poll');
    }
  };

  // Handle vote on poll
  const handleVotePoll = async (pollId: string, optionIndex: number): Promise<{ options: any[]; hasVoted: boolean }> => {
    // Check if user has already voted on this poll
    const poll = allPolls.find(p => p.id === pollId);
    if (poll?.hasVoted) {
      Alert.alert(
        'Already Voted',
        'You have already voted on this poll. Votes cannot be changed.',
        [{ text: 'OK' }]
      );
      // Return current poll data instead of throwing
      return { options: poll.options, hasVoted: true };
    }

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
      // Update poll in both states
      setPolls(polls.map(p =>
        p.id === pollId ? { ...p, options: data.options, hasVoted: true } : p
      ));
      setVotedPolls(votedPolls.map(p =>
        p.id === pollId ? { ...p, options: data.options, hasVoted: true } : p
      ));
      return {
        options: data.options,
        hasVoted: true
      };
    } else {
      Alert.alert('Error', data.message || 'Failed to vote');
      throw new Error(data.message || 'Failed to vote');
    }
  };

  // Handle share poll
  const handleSharePoll = async (pollId: string, question: string) => {
    try {
      const pollUrl = `myapp://poll/${pollId}`;
      await Share.share({
        message: `Check out this poll: "${question}"\n\n${pollUrl}`,
        title: 'Share Poll',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleFollowers = () => {
    if (user?.id) {
      router.push({ pathname: '/followers', params: { userId: user.id } });
    }
  };

  const handleFollowing = () => {
    if (user?.id) {
      router.push({ pathname: '/following', params: { userId: user.id } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Logo Header with Settings */}
      <View style={styles.logoHeader}>
        <View style={styles.headerSpacer} />
        <Image
          source={require('../../assets/images/ican.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Settings size={24} color="#101720" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileTopRow}>
            <Image
              source={{ uri: getProfileImageUrl() }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.fullName || 'User'}</Text>
              <Text style={styles.bio}>
                {user?.bio || 'No bio yet'}
              </Text>
              <View style={styles.statsRow}>
                <TouchableOpacity onPress={handleFollowers}>
                  <Text style={styles.statsText}>
                    <Text style={styles.statsNumber}>{stats.followersCount}</Text> Followers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFollowing}>
                  <Text style={styles.statsText}>
                    <Text style={styles.statsNumber}>{stats.followingCount}</Text> Following
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
              <Text style={styles.shareButtonText}>Share profile</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Polls Section - Single Column */}
        <View style={styles.pollsSection}>
          {(loadingPolls || loadingVotedPolls) ? (
            <View style={styles.pollsLoading}>
              <ActivityIndicator size="small" color="#458FD0" />
              <Text style={styles.pollsLoadingText}>Loading polls...</Text>
            </View>
          ) : allPolls.length === 0 ? (
            <View style={styles.noPollsContainer}>
              <Text style={styles.noPollsText}>No polls yet</Text>
              <Text style={styles.noPollsSubtext}>Create your first poll!</Text>
            </View>
          ) : (
            allPolls.map((poll) => (
              <View key={poll.id} style={styles.pollCard}>
                {/* You voted label - appears above entire poll */}
                {!poll.isOwn && poll.hasVoted && (
                  <Text style={styles.votedLabelTop}>You voted</Text>
                )}

                {/* Poll Header with User Info */}
                <View style={styles.pollHeader}>
                  <View style={styles.pollUserInfo}>
                    <Image
                      source={{
                        uri: poll.isOwn
                          ? getProfileImageUrl()
                          : getProfileImage(poll.user?.avatar)
                      }}
                      style={styles.smallAvatar}
                    />
                    <View style={styles.pollTextInfo}>
                      <Text style={styles.pollUserName}>
                        {poll.isOwn ? (user?.fullName || 'User') : (poll.user?.fullName || poll.user?.name || 'User')}
                      </Text>
                      <Text style={styles.pollQuestion}>{poll.question}</Text>
                    </View>
                  </View>
                  <Text style={styles.pollTime}>{formatTimeAgo(poll.createdAt)}</Text>
                </View>

                {/* Poll Options */}
                <View style={styles.pollOptions}>
                  {poll.options.map((option: { text: string; percentage: number }, index: number) => {
                    // Determine text color based on whether fill has reached the text
                    // If percentage >= 50%, the fill has likely reached the center text
                    const textReachedByFill = poll.hasVoted && option.percentage >= 50;

                    return (
                      <View key={index} style={styles.pollOptionRow}>
                        <TouchableOpacity
                          style={[
                            styles.pollOption,
                            poll.hasVoted && styles.pollOptionVoted,
                            !poll.hasVoted && styles.pollOptionUnvoted,
                            // Blue border for the option the user voted for
                            !poll.isOwn && poll.votedOptionIndex === index && styles.pollOptionVotedBlue,
                          ]}
                          onPress={() => handleVotePoll(poll.id, index)}
                        >
                          {poll.hasVoted && (
                            <View
                              style={[
                                styles.optionProgress,
                                // Blue color for the option the user voted for
                                !poll.isOwn && poll.votedOptionIndex === index && styles.optionProgressBlue,
                                { width: `${option.percentage}%` },
                              ]}
                            />
                          )}
                          <Text style={[
                            styles.optionText,
                            poll.hasVoted && styles.optionTextVoted,
                            !poll.hasVoted && styles.optionTextUnvoted,
                            !poll.isOwn && poll.votedOptionIndex === index && styles.optionTextBlue,
                            textReachedByFill && !(!poll.isOwn && poll.votedOptionIndex === index) && styles.optionTextWhite,
                          ]}>{option.text}</Text>
                        </TouchableOpacity>
                        {poll.hasVoted && (
                          <Text style={styles.percentage}>{option.percentage}%</Text>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Poll Footer with Actions - Show likes for all polls */}
                <View style={styles.pollFooter}>
                  <View style={styles.footerLeft}>
                    {/* Heart icon - show for all polls, but only interactive for non-own polls */}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => !poll.isOwn && handleLikePoll(poll.id)}
                      disabled={poll.isOwn}
                    >
                      <Heart
                        size={18}
                        color={poll.isLiked ? "#FF4444" : "#6C7278"}
                        fill={poll.isLiked ? "#FF4444" : "transparent"}
                      />
                    </TouchableOpacity>
                    {/* Likes count - for all polls */}
                    <TouchableOpacity onPress={() => router.push(`/poll/${poll.id}/likes`)}>
                      <Text style={styles.likesCount}>{poll.likes}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Center: Share */}
                  <View style={styles.footerCenter}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSharePoll(poll.id, poll.question)}
                    >
                      <SendIcon size={18} color="#6C7278" />
                    </TouchableOpacity>
                  </View>

                  {/* Right: Delete (only for own polls) */}
                  <View style={styles.footerRight}>
                    {poll.isOwn && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeletePoll(poll.id)}
                      >
                        <Trash2 size={18} color="#FF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 80,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  // Logo Header Styles
  logoHeader: {
    paddingTop: 40,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerSpacer: {
    width: 24,
  },
  settingsButton: {
    padding: 4,
  },
  logo: {
    width: 30,
    height: 40,
  },
  // Profile Header Styles
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  profileTopRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    color: '#6C7278',
    lineHeight: 18,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsText: {
    fontSize: 13,
    color: '#6C7278',
  },
  statsNumber: {
    fontWeight: 'bold',
    color: '#000000',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#458FD0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#458FD0',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22.4,
  },
  shareButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#458FD0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#458FD0',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22.4,
  },
  // Tabs Styles
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#458FD0',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6C7278',
  },
  activeTabText: {
    color: '#458FD0',
    fontWeight: '600',
  },
  // Polls Section Styles
  pollsSection: {
    paddingHorizontal: 0,
    gap: 0,
  },
  pollCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pollUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  pollTextInfo: {
    flex: 1,
  },
  pollUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  pollQuestion: {
    fontSize: 14,
    color: '#6C7278',
    lineHeight: 20,
  },
  pollTime: {
    fontSize: 12,
    color: '#6C7278',
  },
  votedLabel: {
    fontSize: 12,
    color: '#458FD0',
    fontWeight: '600',
    marginBottom: 2,
  },
  votedLabelTop: {
    fontSize: 12,
    color: '#458FD0',
    fontWeight: '600',
    marginBottom: 6,
  },
  pollOptions: {
    gap: 8,
    marginBottom: 8,
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollOption: {
    flex: 1,
    height: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pollOptionUnvoted: {
    borderColor: '#458FD0',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  pollOptionVoted: {
    borderWidth: 1,
    borderColor: '#6C7278',
    backgroundColor: '#F5F5F5',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
  },
  pollOptionVotedBlue: {
    borderColor: '#458FD0',
  },
  optionContent: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6C7278',
    borderRadius: 4,
  },
  optionProgressBlue: {
    backgroundColor: '#458FD0',
  },
  optionText: {
    fontSize: 14,
    color: '#101720',
    zIndex: 1,
    textAlign: 'center',
  },
  optionTextVoted: {
    color: '#6C7278',
    fontWeight: '600',
  },
  optionTextUnvoted: {
    color: '#458FD0',
    fontWeight: '600',
  },
  optionTextBlue: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '500',
    marginLeft: 12,
    minWidth: 35,
    textAlign: 'right',
  },
  pollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 1,  // Move like 1px to the right
  },
  footerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 1,  // Move delete 1px to the left
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  likesCount: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  likedText: {
    color: '#FF4444',
  },
  pollsLoading: {
    padding: 20,
    alignItems: 'center',
  },
  pollsLoadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  noPollsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noPollsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noPollsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

