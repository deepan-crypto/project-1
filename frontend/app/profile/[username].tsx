import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Alert,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import API_BASE_URL from '@/config/api';
import { authStorage } from '@/utils/authStorage';
import PollCard from '@/components/PollCard';

interface UserProfile {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profilePicture: string;
    isPrivate: boolean;
    followers: string[];
    following: string[];
}

interface Poll {
    _id: string;
    question: string;
    options: {
        id: string;
        text: string;
        votes: string[];
        emoji?: string;
    }[];
    user: {
        _id: string;
        fullName: string;
        username: string;
        profilePicture: string;
    };
    likes: string[];
    createdAt: string;
}

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [polls, setPolls] = useState<Poll[]>([]);
    const [pollsLoading, setPollsLoading] = useState(false);

    useEffect(() => {
        const loadCurrentUser = async () => {
            const userData = await authStorage.getUser();
            if (userData) {
                setCurrentUserId(userData.id);
            }
        };
        loadCurrentUser();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await authStorage.getToken();
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                console.log('Fetching profile for username:', username);
                const response = await fetch(`${API_BASE_URL}/users/username/${username}`, { headers });
                const data = await response.json();

                if (response.ok && data.user) {
                    setUser(data.user);

                    // Check if current user follows this user
                    const currentUser = await authStorage.getUser();
                    if (currentUser && data.user.followers) {
                        setIsFollowing(data.user.followers.some((f: any) =>
                            f.toString() === currentUser.id || f === currentUser.id
                        ));
                    }

                    // Check for pending follow request if private
                    if (data.user.isPrivate && currentUser && !data.user.followers?.includes(currentUser.id)) {
                        await checkPendingRequest(data.user.id);
                    }
                } else {
                    setError(data.message || 'User not found');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const checkPendingRequest = async (userId: string) => {
        try {
            const token = await authStorage.getToken();
            if (!token) return;

            // Use search endpoint to check request status
            const response = await fetch(`${API_BASE_URL}/users/search?q=${username}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();

            if (response.ok && data.users) {
                const targetUser = data.users.find((u: any) => u.id === userId);
                if (targetUser) {
                    setHasPendingRequest(targetUser.hasPendingRequest);
                    setIsFollowing(targetUser.isFollowing);
                }
            }
        } catch (error) {
            console.error('Error checking pending request:', error);
        }
    };

    useEffect(() => {
        const fetchUserPolls = async () => {
            if (!user?.id) return;

            setPollsLoading(true);
            try {
                const token = await authStorage.getToken();
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${API_BASE_URL}/polls/user/${user.id}`, { headers });
                const data = await response.json();

                if (response.ok && data.polls) {
                    setPolls(data.polls);
                }
            } catch (error) {
                console.error('Error fetching user polls:', error);
            } finally {
                setPollsLoading(false);
            }
        };

        fetchUserPolls();
    }, [user?.id]);

    const handleFollow = async () => {
        if (!user) return;

        setActionLoading(true);
        try {
            const token = await authStorage.getToken();
            if (!token) {
                Alert.alert('Error', 'Please log in to follow users');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/${user.id}/follow`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = await response.json();

            if (response.ok) {
                if (data.requestSent) {
                    setHasPendingRequest(true);
                    Alert.alert('Request Sent', 'Follow request has been sent');
                } else {
                    setIsFollowing(true);
                }
            } else {
                Alert.alert('Error', data.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!user) return;

        setActionLoading(true);
        try {
            const token = await authStorage.getToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/users/${user.id}/unfollow`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setIsFollowing(false);
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to unfollow user');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const getProfileImageUrl = () => {
        if (!user?.profilePicture) {
            return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';
        }
        if (user.profilePicture.startsWith('http')) {
            return `${user.profilePicture}?t=${Date.now()}`;
        }
        return `${API_BASE_URL.replace('/api', '')}${user.profilePicture}?t=${Date.now()}`;
    };

    const isOwnProfile = currentUserId && user?.id === currentUserId;

    const renderFollowButton = () => {
        if (isOwnProfile) {
            return null; // Don't show follow button on own profile
        }

        if (actionLoading) {
            return (
                <View style={styles.followButton}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
            );
        }

        if (isFollowing) {
            return (
                <TouchableOpacity style={styles.followingButton} onPress={handleUnfollow}>
                    <Text style={styles.followingButtonText}>Following</Text>
                </TouchableOpacity>
            );
        }

        if (hasPendingRequest) {
            return (
                <View style={styles.requestedButton}>
                    <Text style={styles.requestedButtonText}>Requested</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#458FD0" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error || !user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'User not found'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <ArrowLeft size={24} color="#101720" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>@{user.username}</Text>
                <View style={styles.headerButton} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: getProfileImageUrl() }}
                        style={styles.profileImage}
                    />
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{user.fullName}</Text>
                        {user.isPrivate && <Text style={styles.privateBadge}>🔒</Text>}
                    </View>
                    <Text style={styles.username}>@{user.username}</Text>
                    {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{user.followers?.length || 0}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{user.following?.length || 0}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{polls.length}</Text>
                            <Text style={styles.statLabel}>Polls</Text>
                        </View>
                    </View>

                    {/* Follow Button */}
                    {renderFollowButton()}
                </View>

                {/* Polls Section */}
                <View style={styles.pollsSection}>
                    <View style={styles.pollsHeader}>
                        <Text style={styles.pollsHeaderText}>Polls</Text>
                    </View>

                    {pollsLoading ? (
                        <View style={styles.pollsLoadingContainer}>
                            <ActivityIndicator size="large" color="#458FD0" />
                        </View>
                    ) : polls.length === 0 ? (
                        <View style={styles.emptyPollsContainer}>
                            <Text style={styles.emptyPollsText}>No polls yet</Text>
                            <Text style={styles.emptyPollsSubtext}>
                                {isOwnProfile ? "Create your first poll!" : `${user.fullName} hasn't created any polls yet`}
                            </Text>
                        </View>
                    ) : (
                        polls.map((poll) => (
                            <View key={poll._id} style={styles.pollCardWrapper}>
                                <PollCard
                                    id={poll._id}
                                    user={{
                                        name: poll.user.fullName,
                                        avatar: poll.user.profilePicture
                                            ? poll.user.profilePicture.startsWith('http')
                                                ? poll.user.profilePicture
                                                : `${API_BASE_URL.replace('/api', '')}${poll.user.profilePicture}`
                                            : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
                                    }}
                                    question={poll.question}
                                    options={poll.options.map((opt, idx) => {
                                        const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes?.length || 0), 0);
                                        const percentage = totalVotes > 0 ? Math.round(((opt.votes?.length || 0) / totalVotes) * 100) : 0;
                                        return {
                                            id: opt.id || idx.toString(),
                                            text: opt.text,
                                            percentage,
                                            emoji: opt.emoji,
                                        };
                                    })}
                                    likes={poll.likes?.length || 0}
                                    hasVoted={poll.options.some(opt => opt.votes?.includes(currentUserId || ''))}
                                    isLiked={poll.likes?.includes(currentUserId || '')}
                                    createdAt={poll.createdAt}
                                />
                            </View>
                        ))
                    )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#458FD0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerButton: {
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#101720',
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        padding: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#458FD0',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101720',
    },
    privateBadge: {
        marginLeft: 8,
        fontSize: 16,
    },
    username: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 20,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 40,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#101720',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    followButton: {
        backgroundColor: '#458FD0',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
        minWidth: 120,
        alignItems: 'center',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#458FD0',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
        minWidth: 120,
        alignItems: 'center',
    },
    followingButtonText: {
        color: '#458FD0',
        fontSize: 16,
        fontWeight: '600',
    },
    requestedButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
        minWidth: 120,
        alignItems: 'center',
    },
    requestedButtonText: {
        color: '#6C7278',
        fontSize: 16,
        fontWeight: '600',
    },
    pollsSection: {
        marginTop: 8,
        paddingBottom: 20,
    },
    pollsHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
    },
    pollsHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
    },
    pollsLoadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyPollsContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyPollsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
        marginBottom: 8,
    },
    emptyPollsSubtext: {
        fontSize: 14,
        color: '#6C7278',
        textAlign: 'center',
    },
    pollCardWrapper: {
        marginBottom: 0,
    },
});
