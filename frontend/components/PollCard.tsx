import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Share2 } from 'lucide-react-native';

interface PollOption {
  id: string;
  text: string;
  percentage: number;
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
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.question}>{question}</Text>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionButton}>
            <View style={styles.optionContent}>
              {hasVoted && (
                <View
                  style={[
                    styles.optionProgress,
                    { width: `${option.percentage}%` },
                  ]}
                />
              )}
              <Text style={styles.optionText}>{option.text}</Text>
            </View>
            {hasVoted && (
              <Text style={styles.percentage}>{option.percentage}%</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.likes}>
          <Heart size={18} color="#687684" />
          <Text style={styles.likesText}>{likes}</Text>
        </View>
        <TouchableOpacity>
          <Share2 size={18} color="#687684" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  question: {
    fontSize: 14,
    color: '#687684',
    lineHeight: 20,
  },
  options: {
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#458FD0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionContent: {
    flex: 1,
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(69, 143, 208, 0.2)',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#101720',
    zIndex: 1,
    textAlign: 'center',
  },
  percentage: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '500',
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likesText: {
    fontSize: 14,
    color: '#687684',
  },
});

