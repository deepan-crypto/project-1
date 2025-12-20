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
    Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import API_BASE_URL from '@/config/api';
import { authStorage } from '@/utils/authStorage';

interface PollOption {
    id: number;
    text: string;
    percentage: number;
    emoji?: string;
}

interface Poll {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    question: string;
    options: PollOption[];
    likes: number;
    hasVoted: boolean;
}

export default function PollDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                console.log('Fetching poll:', id);
                const response = await fetch(`${API_BASE_URL}/polls/${id}`);
                const data = await response.json();

                if (response.ok && data.poll) {
                    setPoll(data.poll);
                    setLikes(data.poll.likes);
                } else {
                    setError(data.message || 'Poll not found');
                }
            } catch (err) {
                console.error('Error fetching poll:', err);
                setError('Failed to load poll');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPoll();
        }
    }, [id]);

    const getAvatarUrl = () => {
        if (!poll?.user.avatar) {
            return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100';
        }
        if (poll.user.avatar.startsWith('http')) {
            return poll.user.avatar;
        }
        return `${API_BASE_URL.replace('/api', '')}${poll.user.avatar}`;
    };

    const handleLike = async () => {
        try {
            const token = await authStorage.getToken();
            if (!token) return;

            const endpoint = isLiked ? 'unlike' : 'like';
            const method = isLiked ? 'DELETE' : 'POST';

            const response = await fetch(`${API_BASE_URL}/polls/${id}/${endpoint}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setLikes(data.likesCount);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error('Error liking poll:', error);
        }
    };

    const handleShare = async () => {
        try {
            const pollUrl = `myapp://poll/${id}`;
            await Share.share({
                message: `Check out this poll: "${poll?.question}"\n\n${pollUrl}`,
                title: 'Share Poll',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#458FD0" />
                <Text style={styles.loadingText}>Loading poll...</Text>
            </View>
        );
    }

    if (error || !poll) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Poll not found'}</Text>
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
                <Text style={styles.headerTitle}>Poll</Text>
                <View style={styles.headerButton} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Poll Card */}
                <View style={styles.pollCard}>
                    {/* User info */}
                    <View style={styles.userRow}>
                        <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />
                        <Text style={styles.userName}>{poll.user.name}</Text>
                    </View>

                    {/* Question */}
                    <Text style={styles.question}>{poll.question}</Text>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {poll.options.map((option, index) => (
                            <View key={index} style={styles.optionRow}>
                                <View style={[
                                    styles.option,
                                    poll.hasVoted && styles.optionVoted,
                                ]}>
                                    {poll.hasVoted && (
                                        <View
                                            style={[
                                                styles.progressBar,
                                                { width: `${option.percentage}%` }
                                            ]}
                                        />
                                    )}
                                    <Text style={styles.optionText}>
                                        {option.text} {option.emoji || ''}
                                    </Text>
                                </View>
                                {poll.hasVoted && (
                                    <Text style={styles.percentage}>{option.percentage}%</Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                            <Heart
                                size={20}
                                color={isLiked ? "#FF4444" : "#687684"}
                                fill={isLiked ? "#FF4444" : "transparent"}
                            />
                            <Text style={[styles.actionText, isLiked && styles.likedText]}>{likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Share2 size={20} color="#687684" />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>
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
    pollCard: {
        padding: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        color: '#101720',
        marginBottom: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    option: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
    },
    optionVoted: {
        backgroundColor: '#E8F4FD',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#458FD0',
        opacity: 0.3,
    },
    optionText: {
        fontSize: 16,
        color: '#101720',
        zIndex: 1,
    },
    percentage: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#458FD0',
        width: 40,
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: '#687684',
    },
    likedText: {
        color: '#FF4444',
    },
});
