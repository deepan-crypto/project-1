import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import API_BASE_URL from '@/config/api';

interface LikedUser {
    id: string;
    username: string;
    fullName: string;
    profilePicture: string;
    likedAt: string;
}

export default function PollLikesScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [users, setUsers] = useState<LikedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                console.log('Fetching likes for poll:', id);
                const response = await fetch(`${API_BASE_URL}/polls/${id}/likes`);
                const data = await response.json();

                if (response.ok && data.users) {
                    setUsers(data.users);
                } else {
                    setError(data.message || 'Failed to load likes');
                }
            } catch (err) {
                console.error('Error fetching likes:', err);
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLikes();
        }
    }, [id]);

    const getProfileImageUrl = (profilePicture: string) => {
        if (!profilePicture) {
            return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100';
        }
        if (profilePicture.startsWith('http')) {
            return profilePicture;
        }
        return `${API_BASE_URL.replace('/api', '')}${profilePicture}`;
    };

    const getTimeAgo = (timestamp: string) => {
        if (!timestamp) {
            return 'Some time ago'; // Fallback for old likes without timestamp
        }

        const now = new Date();
        const likedTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - likedTime.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else if (diffInSeconds < 2592000) {
            const weeks = Math.floor(diffInSeconds / 604800);
            return `${weeks}w ago`;
        } else {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months}mo ago`;
        }
    };

    const renderUser = ({ item }: { item: LikedUser }) => (
        <TouchableOpacity
            style={styles.userRow}
            onPress={() => router.push(`/profile/${item.username}`)}
        >
            <Image
                source={{ uri: getProfileImageUrl(item.profilePicture) }}
                style={styles.avatar}
            />
            <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                    <Text style={styles.fullName}>{item.fullName}</Text>
                    <Text style={styles.timeText}>{getTimeAgo(item.likedAt)}</Text>
                </View>
                <Text style={styles.username}>@{item.username}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#458FD0" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <ArrowLeft size={24} color="#101720" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Likes</Text>
                <View style={styles.headerButton} />
            </View>

            {/* Content */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : users.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No likes yet</Text>
                    <Text style={styles.emptySubtext}>Be the first to like this poll!</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUser}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
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
    listContent: {
        padding: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fullName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
    },
    timeText: {
        fontSize: 12,
        color: '#687684',
    },
    username: {
        fontSize: 14,
        color: '#687684',
        marginTop: 2,
    },
});
