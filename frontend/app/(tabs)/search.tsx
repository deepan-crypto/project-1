import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';
import { getProfileImageUrl } from '@/utils/profileImageUtils';

interface SearchUser {
    id: string;
    fullName: string;
    username: string;
    profilePicture: string;
    isPrivate: boolean;
    isFollowing: boolean;
    hasPendingRequest: boolean;
}

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                searchUsers();
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const searchUsers = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const token = await authStorage.getToken();
            const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok && data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId: string, isPrivate: boolean) => {
        setActionLoading(userId);
        try {
            const token = await authStorage.getToken();
            const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state
                setUsers(users.map(user => {
                    if (user.id === userId) {
                        if (data.requestSent) {
                            return { ...user, hasPendingRequest: true };
                        } else {
                            return { ...user, isFollowing: true };
                        }
                    }
                    return user;
                }));

                if (data.requestSent) {
                    Alert.alert('Request Sent', 'Follow request has been sent');
                }
            } else {
                Alert.alert('Error', data.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnfollow = async (userId: string) => {
        setActionLoading(userId);
        try {
            const token = await authStorage.getToken();
            const response = await fetch(`${API_BASE_URL}/users/${userId}/unfollow`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, isFollowing: false } : user
                ));
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to unfollow user');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };



    const handleUserPress = (username: string) => {
        try {
            // Navigate to user profile using the same pattern as followers/following pages
            router.push({ pathname: '/profile/[username]', params: { username } });
        } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Error', 'Unable to view profile. Please try again.');
        }
    };

    const renderActionButton = (user: SearchUser) => {
        const isLoading = actionLoading === user.id;

        if (user.isFollowing) {
            return (
                <TouchableOpacity
                    style={styles.followingButton}
                    onPress={() => handleUnfollow(user.id)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#458FD0" />
                    ) : (
                        <Text style={styles.followingButtonText}>Following</Text>
                    )}
                </TouchableOpacity>
            );
        }

        if (user.hasPendingRequest) {
            return (
                <View style={styles.requestedButton}>
                    <Text style={styles.requestedButtonText}>Requested</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={styles.followButton}
                onPress={() => handleFollow(user.id, user.isPrivate)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.followButtonText}>Follow</Text>
                )}
            </TouchableOpacity>
        );
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

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <SearchIcon size={20} color="#6C7278" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor="#6C7278"
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* Results */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#458FD0" />
                </View>
            ) : query.trim() && users.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users found</Text>
                    <Text style={styles.emptySubtext}>Try a different search term</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    {users.map((user) => (
                        <View key={user.id} style={styles.userCard}>
                            <TouchableOpacity
                                style={styles.userCardContent}
                                onPress={() => handleUserPress(user.username)}
                            >
                                <Image
                                    source={{ uri: getProfileImageUrl(user.profilePicture) }}
                                    style={styles.avatar}
                                />
                                <View style={styles.userInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.fullName}>{user.fullName}</Text>
                                        {user.isPrivate && <Text style={styles.privateBadge}>🔒</Text>}
                                    </View>
                                    <Text style={styles.username}>@{user.username}</Text>
                                </View>
                            </TouchableOpacity>
                            {renderActionButton(user)}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#101720',
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
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
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
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fullName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
        marginBottom: 2,
    },
    privateBadge: {
        marginLeft: 6,
        fontSize: 12,
    },
    username: {
        fontSize: 14,
        color: '#6C7278',
    },
    followButton: {
        backgroundColor: '#458FD0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 90,
        alignItems: 'center',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#458FD0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 90,
        alignItems: 'center',
    },
    followingButtonText: {
        color: '#458FD0',
        fontSize: 14,
        fontWeight: '600',
    },
    requestedButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 90,
        alignItems: 'center',
    },
    requestedButtonText: {
        color: '#6C7278',
        fontSize: 14,
        fontWeight: '600',
    },
});
