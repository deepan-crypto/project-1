import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';

interface Following {
    _id: string;
    fullName: string;
    username: string;
    profilePicture: string;
}

export default function FollowingScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const [following, setFollowing] = useState<Following[]>([]);
    const [filteredFollowing, setFilteredFollowing] = useState<Following[]>([]);
    const [loading, setLoading] = useState(true);
    const [unfollowing, setUnfollowing] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCurrentUser();
        if (userId) {
            fetchFollowing();
        }
    }, [userId]);

    useEffect(() => {
        filterFollowing();
    }, [searchQuery, following]);

    const loadCurrentUser = async () => {
        const user = await authStorage.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }
    };

    const fetchFollowing = async () => {
        try {
            const token = await authStorage.getToken();
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/users/${userId}/following`, { headers });
            const data = await response.json();

            if (response.ok && data.following) {
                setFollowing(data.following);
                setFilteredFollowing(data.following);
            }
        } catch (error) {
            console.error('Error fetching following:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterFollowing = () => {
        if (!searchQuery.trim()) {
            setFilteredFollowing(following);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = following.filter(
            (user) =>
                user.fullName.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query)
        );
        setFilteredFollowing(filtered);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleUnfollow = async (targetUserId: string) => {
        // Only allow unfollowing from own profile
        if (userId !== currentUserId) return;

        Alert.alert(
            'Unfollow',
            'Are you sure you want to unfollow this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unfollow',
                    style: 'destructive',
                    onPress: async () => {
                        setUnfollowing(targetUserId);
                        try {
                            const token = await authStorage.getToken();
                            const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/unfollow`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });

                            if (response.ok) {
                                setFollowing(following.filter(f => f._id !== targetUserId));
                            } else {
                                const data = await response.json();
                                Alert.alert('Error', data.message || 'Failed to unfollow');
                            }
                        } catch (error) {
                            console.error('Error unfollowing:', error);
                            Alert.alert('Error', 'Network error. Please try again.');
                        } finally {
                            setUnfollowing(null);
                        }
                    },
                },
            ]
        );
    };

    const getProfileImageUrl = (profilePicture: string) => {
        if (!profilePicture) {
            return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';
        }
        if (profilePicture.startsWith('http')) {
            return profilePicture;
        }
        return `${API_BASE_URL.replace('/api', '')}${profilePicture}`;
    };

    const handleUserPress = (username: string) => {
        router.push({ pathname: '/profile/[username]', params: { username } });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#101720" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Following</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Search size={20} color="#6C7278" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search following..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <X size={18} color="#6C7278" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#458FD0" />
                </View>
            ) : following.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Not following anyone</Text>
                    <Text style={styles.emptySubtext}>When you follow people, they'll appear here</Text>
                </View>
            ) : filteredFollowing.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try searching with a different name or username</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    {filteredFollowing.map((user) => (
                        <View key={user._id} style={styles.userCard}>
                            <TouchableOpacity
                                style={styles.userCardContent}
                                onPress={() => handleUserPress(user.username)}
                            >
                                <Image
                                    source={{ uri: getProfileImageUrl(user.profilePicture) }}
                                    style={styles.avatar}
                                />
                                <View style={styles.userInfo}>
                                    <Text style={styles.fullName}>{user.fullName}</Text>
                                    <Text style={styles.username}>@{user.username}</Text>
                                </View>
                            </TouchableOpacity>
                            {userId === currentUserId && (
                                <TouchableOpacity
                                    style={styles.unfollowButton}
                                    onPress={() => handleUnfollow(user._id)}
                                    disabled={unfollowing === user._id}
                                >
                                    {unfollowing === user._id ? (
                                        <ActivityIndicator size="small" color="#FF4444" />
                                    ) : (
                                        <Text style={styles.unfollowButtonText}>Unfollow</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#101720',
    },
    headerSpacer: {
        width: 32,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#101720',
        padding: 0,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#101720',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6C7278',
        marginTop: 8,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    userCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    fullName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
        marginBottom: 2,
    },
    username: {
        fontSize: 14,
        color: '#6C7278',
    },
    unfollowButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FF4444',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    unfollowButtonText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '600',
    },
});
