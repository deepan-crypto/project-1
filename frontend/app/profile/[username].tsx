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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import API_BASE_URL from '@/config/api';

interface UserProfile {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profilePicture: string;
    followers: string[];
    following: string[];
}

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log('Fetching profile for username:', username);
                const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
                const data = await response.json();

                if (response.ok && data.user) {
                    setUser(data.user);
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

    const getProfileImageUrl = () => {
        if (!user?.profilePicture) {
            return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';
        }
        if (user.profilePicture.startsWith('http')) {
            return user.profilePicture;
        }
        return `${API_BASE_URL.replace('/api', '')}${user.profilePicture}`;
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
                    <Text style={styles.name}>{user.fullName}</Text>
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
                    </View>

                    {/* Follow Button (placeholder) */}
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101720',
        marginTop: 16,
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
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
