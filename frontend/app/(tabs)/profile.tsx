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
import { Heart, Share2, ArrowRight } from 'lucide-react-native';

const mockUserPolls = [
  {
    id: '1',
    question: 'Whats best for a daily ride?',
    options: [
      { text: 'Hybrid', percentage: 20 },
      { text: 'City Bike', percentage: 80 },
    ],
    likes: 363,
    voted: false,
    time: 'Today',
  },
  {
    id: '2',
    question: 'Average distance for a good workout!',
    options: [
      { text: '25kms', percentage: 75 },
      { text: '50kms', percentage: 52 },
    ],
    likes: 363,
    voted: true,
    time: '1 year ago',
  },
  {
    id: '3',
    question: 'Speed thats good for climbing',
    options: [
      { text: '24', percentage: 35 },
      { text: '20', percentage: 50 },
      { text: '22', percentage: 75 },
    ],
    likes: 363,
    voted: true,
    time: '2 years ago',
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

      {/* Logo Header */}
      <View style={styles.logoHeader}>
        <Image
          source={require('../../assets/images/ican.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileTopRow}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Abigail</Text>
              <Text style={styles.bio}>
                Bicycle enthusiast. Love to talk about bicycles and cycling!
              </Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  <Text style={styles.statsNumber}>523</Text> Followers
                </Text>
                <Text style={styles.statsText}>
                  <Text style={styles.statsNumber}>523</Text> Following
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
              <Text style={styles.shareButtonText}>Share profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Polls Section */}
        <View style={styles.pollsSection}>
          {mockUserPolls.map((poll) => (
            <View key={poll.id} style={styles.pollCard}>
              {/* Poll Header with User Info */}
              <View style={styles.pollHeader}>
                <View style={styles.pollUserInfo}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
                    }}
                    style={styles.smallAvatar}
                  />
                  <View style={styles.pollTextInfo}>
                    <Text style={styles.pollUserName}>Abigail</Text>
                    <Text style={styles.pollQuestion}>{poll.question}</Text>
                  </View>
                </View>
                <Text style={styles.pollTime}>{poll.time}</Text>
              </View>

              {/* Voted Label */}
              {poll.voted && (
                <Text style={styles.votedLabel}>You voted</Text>
              )}

              {/* Poll Options */}
              <View style={styles.pollOptions}>
                {poll.options.map((option, index) => (
                  <View key={index} style={styles.pollOptionContainer}>
                    <View style={[
                      styles.pollOption,
                      poll.voted && styles.pollOptionVoted
                    ]}>
                      <View style={styles.optionContent}>
                        {poll.voted && (
                          <View
                            style={[
                              styles.optionProgress,
                              { width: `${option.percentage}%` },
                            ]}
                          />
                        )}
                        <Text style={[
                          styles.optionText,
                          poll.voted && styles.optionTextVoted
                        ]}>{option.text}</Text>
                      </View>
                    </View>
                    {poll.voted && (
                      <Text style={styles.percentage}>{option.percentage}%</Text>
                    )}
                  </View>
                ))}
              </View>

              {/* Poll Footer with Actions */}
              <View style={styles.pollFooter}>
                <View style={styles.footerLeft}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Heart size={18} color="#6C7278" />
                    <Text style={styles.likesCount}>{poll.likes}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.footerRight}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={18} color="#6C7278" />
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  // Logo Header Styles
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
  // Profile Header Styles
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileTopRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    color: '#6C7278',
    lineHeight: 18,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsText: {
    fontSize: 13,
    color: '#6C7278',
  },
  statsNumber: {
    fontWeight: 'bold',
    color: '#000000',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#458FD0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#458FD0',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22.4,
  },
  shareButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#458FD0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#458FD0',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22.4,
  },
  // Polls Section Styles
  pollsSection: {
    paddingHorizontal: 0,
    gap: 0,
  },
  pollCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pollUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  pollTextInfo: {
    flex: 1,
  },
  pollUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  pollQuestion: {
    fontSize: 14,
    color: '#6C7278',
    lineHeight: 20,
  },
  pollTime: {
    fontSize: 12,
    color: '#6C7278',
  },
  votedLabel: {
    fontSize: 12,
    color: '#458FD0',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 50,
  },
  pollOptions: {
    gap: 8,
    marginBottom: 12,
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#458FD0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pollOptionVoted: {
    borderColor: '#458FD0',
    backgroundColor: '#FFFFFF',
  },
  optionContent: {
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#458FD0',
    borderRadius: 7,
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
    minWidth: 35,
    textAlign: 'right',
  },
  pollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  likesCount: {
    fontSize: 14,
    color: '#6C7278',
  },
});
