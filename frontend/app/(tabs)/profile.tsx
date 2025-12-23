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
import { Heart, Share2, ArrowRight, Trash2, Settings } from 'lucide-react-native';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';

interface UserPoll {
  id: string;
  question: string;
  options: { text: string; percentage: number }[];
  likes: number;
  hasVoted: boolean;
<<<<<<< HEAD
  createdAt: string;
=======
  isLiked?: boolean;
  votedOptionIndex?: number;
  createdAt: string;
  user?: {
    name: string;
    fullName?: string;
    avatar: string;
  };
>>>>>>> master
}

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [polls, setPolls] = useState<UserPoll[]>([]);
<<<<<<< HEAD
  const [loadingPolls, setLoadingPolls] = useState(true);
=======
  const [votedPolls, setVotedPolls] = useState<UserPoll[]>([]);
  const [allPolls, setAllPolls] = useState<(UserPoll & { isOwn: boolean })[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [loadingVotedPolls, setLoadingVotedPolls] = useState(true);
>>>>>>> master
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
<<<<<<< HEAD
        // Fetch user's polls and stats
        fetchUserPolls(userData.id);
=======
        // Fetch user's polls, voted polls, and stats
        fetchUserPolls(userData.id);
        fetchVotedPolls(userData.id);
>>>>>>> master
        fetchUserStats(userData.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Fetch user's polls from API
  const fetchUserPolls = async (userId: string) => {
    try {
      setLoadingPolls(true);
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/polls/user/${userId}`, { headers });
      const data = await response.json();

      if (response.ok && data.polls) {
        setPolls(data.polls);
<<<<<<< HEAD
=======
        // Combine and sort polls after both are loaded
        combinePolls(data.polls, votedPolls);
>>>>>>> master
      }
    } catch (error) {
      console.error('Error fetching user polls:', error);
    } finally {
      setLoadingPolls(false);
    }
  };

<<<<<<< HEAD
=======
  // Fetch polls the user has voted on
  const fetchVotedPolls = async (userId: string) => {
    try {
      setLoadingVotedPolls(true);
      const token = await authStorage.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/polls/user/${userId}/voted`, { headers });
      const data = await response.json();

      if (response.ok && data.polls) {
        setVotedPolls(data.polls);
        // Combine and sort polls after both are loaded
        combinePolls(polls, data.polls);
      }
    } catch (error) {
      console.error('Error fetching voted polls:', error);
    } finally {
      setLoadingVotedPolls(false);
    }
  };

  // Combine own polls and voted polls into single array
  const combinePolls = (ownPolls: UserPoll[], voted: UserPoll[]) => {
    const ownPollsWithFlag = ownPolls.map(p => ({ ...p, isOwn: true }));
    const votedPollsWithFlag = voted.map(p => ({ ...p, isOwn: false }));
    const combined = [...ownPollsWithFlag, ...votedPollsWithFlag];
    // Sort by creation date, newest first
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllPolls(combined);
  };

>>>>>>> master
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
  const getProfileImageUrl = () => {
    if (!user?.profilePicture) {
      return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';
    }
    if (user.profilePicture.startsWith('http')) {
      return user.profilePicture;
    }
    // Convert relative path to full URL
    return `${API_BASE_URL.replace('/api', '')}${user.profilePicture}`;
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
<<<<<<< HEAD
  const handleLikePoll = async (pollId: string) => {
    try {
      const token = await authStorage.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/polls/${pollId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        // Update poll in state
        setPolls(polls.map(p =>
          p.id === pollId ? { ...p, likes: data.likesCount } : p
        ));
      }
    } catch (error) {
      console.error('Error liking poll:', error);
=======
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
>>>>>>> master
    }
  };

  // Handle vote on poll
  const handleVotePoll = async (pollId: string, optionIndex: number): Promise<{ options: any[]; hasVoted: boolean }> => {
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
<<<<<<< HEAD
      // Update poll in state with new options
      setPolls(polls.map(p =>
        p.id === pollId ? { ...p, options: data.options, hasVoted: true } : p
      ));
=======
      // Update poll in both states
      setPolls(polls.map(p =>
        p.id === pollId ? { ...p, options: data.options, hasVoted: true } : p
      ));
      setVotedPolls(votedPolls.map(p =>
        p.id === pollId ? { ...p, options: data.options, hasVoted: true } : p
      ));
>>>>>>> master
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

<<<<<<< HEAD
        {/* Polls Section */}
        <View style={styles.pollsSection}>
          {loadingPolls ? (
=======


        {/* Polls Section - Single Column */}
        <View style={styles.pollsSection}>
          {(loadingPolls || loadingVotedPolls) ? (
>>>>>>> master
            <View style={styles.pollsLoading}>
              <ActivityIndicator size="small" color="#458FD0" />
              <Text style={styles.pollsLoadingText}>Loading polls...</Text>
            </View>
<<<<<<< HEAD
          ) : polls.length === 0 ? (
=======
          ) : allPolls.length === 0 ? (
>>>>>>> master
            <View style={styles.noPollsContainer}>
              <Text style={styles.noPollsText}>No polls yet</Text>
              <Text style={styles.noPollsSubtext}>Create your first poll!</Text>
            </View>
          ) : (
<<<<<<< HEAD
            polls.map((poll: UserPoll) => (
              <View key={poll.id} style={styles.pollCard}>
=======
            allPolls.map((poll) => (
              <View key={poll.id} style={styles.pollCard}>
                {/* You voted label - appears above entire poll */}
                {!poll.isOwn && poll.hasVoted && (
                  <Text style={styles.votedLabelTop}>You voted</Text>
                )}

>>>>>>> master
                {/* Poll Header with User Info */}
                <View style={styles.pollHeader}>
                  <View style={styles.pollUserInfo}>
                    <Image
<<<<<<< HEAD
                      source={{ uri: getProfileImageUrl() }}
                      style={styles.smallAvatar}
                    />
                    <View style={styles.pollTextInfo}>
                      <Text style={styles.pollUserName}>{user?.fullName || 'User'}</Text>
=======
                      source={{
                        uri: poll.isOwn
                          ? getProfileImageUrl()
                          : (poll.user?.avatar ? (poll.user.avatar.startsWith('http') ? poll.user.avatar : `${API_BASE_URL.replace('/api', '')}${poll.user.avatar}`) : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200')
                      }}
                      style={styles.smallAvatar}
                    />
                    <View style={styles.pollTextInfo}>
                      <Text style={styles.pollUserName}>
                        {poll.isOwn ? (user?.fullName || 'User') : (poll.user?.fullName || poll.user?.name || 'User')}
                      </Text>
>>>>>>> master
                      <Text style={styles.pollQuestion}>{poll.question}</Text>
                    </View>
                  </View>
                  <Text style={styles.pollTime}>{formatTimeAgo(poll.createdAt)}</Text>
                </View>

<<<<<<< HEAD
                {/* Voted Label */}
                {poll.hasVoted && (
                  <Text style={styles.votedLabel}>You voted</Text>
                )}

=======
>>>>>>> master
                {/* Poll Options */}
                <View style={styles.pollOptions}>
                  {poll.options.map((option: { text: string; percentage: number }, index: number) => (
                    <View key={index} style={styles.pollOptionRow}>
                      <TouchableOpacity
                        style={[
                          styles.pollOption,
                          poll.hasVoted && styles.pollOptionVoted,
                          !poll.hasVoted && styles.pollOptionUnvoted,
                        ]}
                        onPress={() => handleVotePoll(poll.id, index)}
                      >
                        {poll.hasVoted && (
                          <View
                            style={[
                              styles.optionProgress,
<<<<<<< HEAD
=======
                              // Blue color for the option the user voted for
                              !poll.isOwn && poll.votedOptionIndex === index && styles.optionProgressBlue,
>>>>>>> master
                              { width: `${option.percentage}%` },
                            ]}
                          />
                        )}
                        <Text style={[
                          styles.optionText,
                          poll.hasVoted && styles.optionTextVoted,
                          !poll.hasVoted && styles.optionTextUnvoted,
                        ]}>{option.text}</Text>
                      </TouchableOpacity>
                      {poll.hasVoted && (
                        <Text style={styles.percentage}>{option.percentage}%</Text>
                      )}
                    </View>
                  ))}
                </View>

<<<<<<< HEAD
                {/* Poll Footer with Actions */}
                <View style={styles.pollFooter}>
                  <View style={styles.footerLeft}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLikePoll(poll.id)}
                    >
                      <Heart size={18} color="#6C7278" />
                      <Text style={styles.likesCount}>{poll.likes}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.footerRight}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSharePoll(poll.id, poll.question)}
                    >
                      <Share2 size={18} color="#6C7278" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeletePoll(poll.id)}
                    >
                      <Trash2 size={18} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
=======
                {/* Poll Footer with Actions - Hide likes on own polls */}
                {!poll.isOwn && (
                  <View style={styles.pollFooter}>
                    <View style={styles.footerLeft}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLikePoll(poll.id)}
                      >
                        <Heart
                          size={18}
                          color={poll.isLiked ? "#FF4444" : "#6C7278"}
                          fill={poll.isLiked ? "#FF4444" : "transparent"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => router.push(`/poll/${poll.id}/likes`)}>
                        <Text style={[styles.likesCount, poll.isLiked && styles.likedText]}>{poll.likes} likes</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.footerRight}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSharePoll(poll.id, poll.question)}
                      >
                        <Share2 size={18} color="#6C7278" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Delete button for own polls */}
                {poll.isOwn && (
                  <View style={styles.pollFooter}>
                    <View style={styles.footerLeft} />
                    <View style={styles.footerRight}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSharePoll(poll.id, poll.question)}
                      >
                        <Share2 size={18} color="#6C7278" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeletePoll(poll.id)}
                      >
                        <Trash2 size={18} color="#FF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          )
          }
>>>>>>> master
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
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  // Logo Header Styles
  logoHeader: {
    paddingTop: 40,
    paddingBottom: 12,
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
    paddingVertical: 24,
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
<<<<<<< HEAD
=======
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
>>>>>>> master
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
    marginBottom: 8,
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
<<<<<<< HEAD
    marginBottom: 8,
    marginLeft: 50,
=======
    marginBottom: 2,
  },
  votedLabelTop: {
    fontSize: 12,
    color: '#458FD0',
    fontWeight: '600',
    marginBottom: 8,
>>>>>>> master
  },
  pollOptions: {
    gap: 8,
    marginBottom: 12,
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
    overflow: 'hidden',
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
  },
  optionContent: {
    position: 'relative',
    zIndex: 1,
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
<<<<<<< HEAD
    backgroundColor: '#458FD0',
    borderRadius: 20,
  },
=======
    backgroundColor: '#6C7278',
    borderRadius: 20,
  },
  optionProgressBlue: {
    backgroundColor: '#458FD0',
  },
>>>>>>> master
  optionText: {
    fontSize: 14,
    color: '#101720',
    zIndex: 1,
  },
  optionTextVoted: {
    color: '#101720',
    fontWeight: '600',
  },
  optionTextUnvoted: {
    color: '#458FD0',
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    color: '#101720',
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
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  likesCount: {
    fontSize: 14,
    color: '#6C7278',
  },
<<<<<<< HEAD
=======
  likedText: {
    color: '#FF4444',
  },
>>>>>>> master
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

