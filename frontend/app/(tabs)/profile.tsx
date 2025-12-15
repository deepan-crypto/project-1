import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

const mockUserPolls = [
  {
    id: '1',
    question: 'Whats best for a day?',
    options: [
      { text: 'Hybrid', percentage: 0 },
      { text: 'City Bike', percentage: 0 },
    ],
    likes: 363,
    voted: false,
  },
  {
    id: '2',
    question: 'Average distance for cycling?',
    options: [
      { text: '25kms', percentage: 45 },
      { text: '50kms', percentage: 55 },
    ],
    likes: 363,
    voted: true,
  },
  {
    id: '3',
    question: 'Speed thats good for cycling?',
    options: [
      { text: '24', percentage: 35 },
      { text: '20', percentage: 30 },
      { text: '22', percentage: 35 },
    ],
    likes: 363,
    voted: true,
  },
];

export default function ProfileScreen() {
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: 'Check out my profile on the app!',
        title: 'Share Profile',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Abigail</Text>
          <Text style={styles.bio}>
            Bicycle enthusiast. Love to talk about bicycles and cycling!
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.followers}>523 Followers</Text>
            <Text style={styles.following}>523 Following</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
            <Text style={styles.shareButtonText}>Share profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pollsSection}>
          {mockUserPolls.map((poll) => (
            <View key={poll.id} style={styles.pollCard}>
              <View style={styles.pollHeader}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
                  }}
                  style={styles.smallAvatar}
                />
                <Text style={styles.pollQuestion}>{poll.question}</Text>
              </View>

              <View style={styles.pollOptions}>
                {poll.options.map((option, index) => (
                  <View key={index} style={styles.pollOption}>
                    <View style={styles.optionContent}>
                      {poll.voted && (
                        <View
                          style={[
                            styles.optionProgress,
                            { width: `${option.percentage}%` },
                          ]}
                        />
                      )}
                      <Text style={styles.optionText}>{option.text}</Text>
                    </View>
                    {poll.voted && (
                      <Text style={styles.percentage}>{option.percentage}</Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.pollFooter}>
                <Text style={styles.likes}>{poll.likes}</Text>
                {poll.voted && (
                  <Text style={styles.votedLabel}>You voted</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  followers: {
    fontSize: 14,
    color: '#999',
  },
  following: {
    fontSize: 14,
    color: '#999',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  shareButton: {
    borderWidth: 1,
    borderColor: '#45BFD0',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#45BFD0',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  pollsSection: {
    padding: 16,
    gap: 16,
  },
  pollCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  pollQuestion: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pollOptions: {
    gap: 10,
    marginBottom: 16,
  },
  pollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionContent: {
    flex: 1,
    position: 'relative',
    padding: 12,
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#E8F7FA',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    zIndex: 1,
  },
  percentage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  pollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likes: {
    fontSize: 14,
    color: '#999',
  },
  votedLabel: {
    fontSize: 12,
    color: '#45BFD0',
    fontWeight: '600',
  },
});
