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

interface Follower {
    _id: string;
    fullName: string;
    username: string;
    profilePicture: string;
}

export default function FollowersScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCurrentUser();
        if (userId) {
            fetchFollowers();
        }
    }, [userId]);

    useEffect(() => {
        filterFollowers();
    }, [searchQuery, followers]);

    const loadCurrentUser = async () => {
        const user = await authStorage.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }
    };

    const fetchFollowers = async () => {
        try {
            const token = await authStorage.getToken();
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`, { headers });
            const data = await response.json();

            if (response.ok && data.followers) {
                setFollowers(data.followers);
                setFilteredFollowers(data.followers);
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterFollowers = () => {
        if (!searchQuery.trim()) {
            setFilteredFollowers(followers);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = followers.filter(
            (follower) =>
                follower.fullName.toLowerCase().includes(query) ||
                follower.username.toLowerCase().includes(query)
        );
        setFilteredFollowers(filtered);
    };

    const clearSearch = () => {
        setSearchQuery('');
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
                <Text style={styles.headerTitle}>Followers</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Search size={20} color="#6C7278" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search followers..."
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
            ) : followers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No followers yet</Text>
                    <Text style={styles.emptySubtext}>When people follow you, they'll appear here</Text>
                </View>
            ) : filteredFollowers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try searching with a different name or username</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    {filteredFollowers.map((follower) => (
                        <TouchableOpacity
                            key={follower._id}
                            style={styles.userCard}
                            onPress={() => handleUserPress(follower.username)}
                        >
                            <Image
                                source={{ uri: getProfileImageUrl(follower.profilePicture) }}
                                style={styles.avatar}
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.fullName}>{follower.fullName}</Text>
                                <Text style={styles.username}>@{follower.username}</Text>
                            </View>
                        </TouchableOpacity>
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
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
});
