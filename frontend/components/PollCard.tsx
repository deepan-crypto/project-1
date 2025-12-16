import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Share2 } from 'lucide-react-native';

interface PollOption {
  id: string;
  text: string;
  percentage: number;
  emoji?: string;
}

interface PollCardProps {
  user: {
    name: string;
    avatar: string;
  };
  question: string;
  options: PollOption[];
  likes: number;
  hasVoted?: boolean;
}

export default function PollCard({
  user,
  question,
  options,
  likes,
  hasVoted = false,
}: PollCardProps) {
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
              key={option.id}
              style={[styles.option, styles.optionWithProgress]}
              disabled={hasVoted}
            >
              <View
                style={[
                  styles.progressBar,
                  { width: `${option.percentage}%` },
                  hasVoted ? styles.progressBarVoted : styles.progressBarUnvoted,
                ]}
              />
              <View style={styles.optionContent}>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionText,
                      !hasVoted && styles.optionTextUnvoted,
                    ]}
                  >
                    {option.text}{option.emoji ? ` ${option.emoji}` : ''}
                  </Text>
                </View>
                {hasVoted && (
                  <Text style={styles.optionPercentage}>
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
        <TouchableOpacity style={styles.likeButton}>
          <Heart size={18} color="#687684" />
          <Text style={styles.likesText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={18} color="#687684" />
        </TouchableOpacity>
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
  },
  optionWithProgress: {
    position: 'relative',
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
  },
  progressBarVoted: {
    backgroundColor: '#6C7278', // Gray for voted options
  },
  progressBarNotVoted: {
    backgroundColor: '#6C7278', // Gray (not used, keeping for compatibility)
  },
  progressBarUnvoted: {
    backgroundColor: '#458FD0', // Blue for unvoted options
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionTextUnvoted: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionPercentage: {
    fontSize: 14,
    color: '#101720',
    marginLeft: 8,
  },
  optionPercentageVoted: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  likesText: {
    fontSize: 14,
    color: '#687684',
  },
});



