import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { Heart, Share2, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface PollOption {
  id: string | number;
  text: string;
  percentage: number;
  emoji?: string;
}

interface PollCardProps {
  id?: string;
  user: {
    name: string;
    avatar: string;
  };
  question: string;
  options: PollOption[];
  likes: number;
  hasVoted?: boolean;
  isLiked?: boolean;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => Promise<{ likes: number; liked: boolean }>;
  onVote?: (pollId: string, optionIndex: number) => Promise<{ options: PollOption[]; hasVoted: boolean }>;
}

export default function PollCard({
  id,
  user,
  question,
  options: initialOptions,
  likes: initialLikes,
  hasVoted: initialHasVoted = false,
  isLiked: initialIsLiked = false,
  onDelete,
  onLike,
  onVote,
}: PollCardProps) {
  const [options, setOptions] = useState(initialOptions);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [liking, setLiking] = useState(false);
  const [voting, setVoting] = useState(false);

  // Sync state with props when they change (e.g., after refetch)
  useEffect(() => {
    setOptions(initialOptions);
    setHasVoted(initialHasVoted);
    setLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialOptions, initialHasVoted, initialLikes, initialIsLiked]);

  const handleVote = async (optionIndex: number) => {
    if (!id || !onVote || voting) return;
    setVoting(true);
    try {
      const result = await onVote(id, optionIndex);
      console.log('Vote result:', result);
      console.log('Options received:', result.options);
      if (result.options && result.options.length > 0) {
        setOptions(result.options);
      }
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleLike = async () => {
    if (!id || !onLike || liking) return;
    setLiking(true);
    try {
      const result = await onLike(id);
      setLikes(result.likes);
      setIsLiked(result.liked);
    } catch (error) {
      console.error('Error liking poll:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    if (!id) return;
    try {
      const pollUrl = `myapp://poll/${id}`;
      await Share.share({
        message: `Check out this poll: "${question}"\n\n${pollUrl}`,
        title: 'Share Poll',
        url: pollUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleViewLikes = () => {
    if (!id) return;
    router.push(`/poll/${id}/likes`);
  };

  return (
    <View style={styles.card}>
      {/* Header with user info */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.question}>{question}</Text>
        </View>
      </View>

      {/* Poll Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          return (
            <TouchableOpacity
              key={option.id || index}
              style={[
                styles.option,
                hasVoted && styles.optionWithProgress,
                !hasVoted && styles.optionUnvoted,
              ]}
              onPress={() => handleVote(index)}
              disabled={voting}
            >
              {hasVoted && (
                <View
                  style={[
                    styles.progressBar,
                    { width: `${option.percentage}%` },
                  ]}
                />
              )}
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    hasVoted && styles.optionTextVoted,
                    !hasVoted && styles.optionTextUnvoted,
                  ]}
                >
                  {option.text}{option.emoji ? ` ${option.emoji}` : ''}
                </Text>
                {hasVoted && (
                  <Text style={styles.optionPercentageVoted}>
                    {option.percentage}%
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Footer with likes and share */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLike}
            disabled={liking}
          >
            <Heart
              size={18}
              color={isLiked ? "#FF4444" : "#687684"}
              fill={isLiked ? "#FF4444" : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewLikes}>
            <Text style={[styles.likesText, isLiked && styles.likedText]}>{likes} likes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRight}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={18} color="#687684" />
          </TouchableOpacity>
          {onDelete && id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(id)}
            >
              <Trash2 size={18} color="#FF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101720',
  },
  timeAgo: {
    fontSize: 12,
    color: '#6C7278',
  },
  question: {
    fontSize: 15,
    color: '#101720',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  option: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  optionUnvoted: {
    borderColor: '#458FD0',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  optionWithProgress: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#458FD0',
    borderRadius: 20,
  },
  progressBarVoted: {
    backgroundColor: '#458FD0',
  },
  progressBarNotVoted: {
    backgroundColor: '#6C7278',
  },
  progressBarUnvoted: {
    backgroundColor: '#458FD0',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#101720',
  },
  optionTextVoted: {
    color: '#101720',
    fontWeight: '600',
  },
  optionTextUnvoted: {
    color: '#458FD0',
    fontWeight: '600',
  },
  optionPercentage: {
    fontSize: 14,
    color: '#101720',
    marginLeft: 8,
  },
  optionPercentageVoted: {
    color: '#101720',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  likesText: {
    fontSize: 14,
    color: '#3f87ceff',
  },
  likedText: {
    color: '#FF4444',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
});