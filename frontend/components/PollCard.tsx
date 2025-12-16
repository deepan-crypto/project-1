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
      <View style={styles.options}>
        {options.map((option) => (
          <View key={option.id} style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasVoted && styles.optionButtonVoted
              ]}
            >
              <View style={styles.optionContent}>
                {hasVoted && (
                  <View
                    style={[
                      styles.optionProgress,
                      { width: `${option.percentage}%` },
                    ]}
                  />
                )}
                <Text style={[
                  styles.optionText,
                  hasVoted && styles.optionTextVoted
                ]}>
                  {option.text}{option.emoji ? ` ${option.emoji}` : ''}
                </Text>
              </View>
            </TouchableOpacity>
            {hasVoted && (
              <Text style={styles.percentage}>{option.percentage}%</Text>
            )}
          </View>
        ))}
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
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  header: {
    flexDirection: 'row',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  question: {
    fontSize: 14,
    color: '#6C7278',
    lineHeight: 20,
  },
  options: {
    gap: 8,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#458FD0',
    borderRadius: 25,
    overflow: 'hidden',
  },
  optionButtonVoted: {
    borderWidth: 0,
  },
  optionContent: {
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#458FD0',
    borderRadius: 25,
  },
  optionText: {
    fontSize: 14,
    color: '#101720',
    zIndex: 1,
    textAlign: 'center',
  },
  optionTextVoted: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '500',
    marginLeft: 12,
    minWidth: 40,
    textAlign: 'right',
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



