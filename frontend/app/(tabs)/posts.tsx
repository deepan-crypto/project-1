import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { X, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from '@/config/api';
import { authStorage } from '@/utils/authStorage';
import { getProfileImageUrl as getProfileImage } from '@/utils/profileImageUtils';

export default function PostsScreen() {
  const [question, setQuestion] = useState('');
  const [thought1, setThought1] = useState('');
  const [thought2, setThought2] = useState('');
  const [thought3, setThought3] = useState('');
  const [thought4, setThought4] = useState('');
  const [visibleThoughts, setVisibleThoughts] = useState(2); // Start with 2 visible thoughts
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const userData = await authStorage.getUser();
      if (userData) {
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  // Get profile image URL
  const getProfileImageUrl = () => getProfileImage(user?.profilePicture);

  const handleAddThought = () => {
    if (visibleThoughts < 4) {
      setVisibleThoughts(visibleThoughts + 1);
    }
  };

  const handlePost = async () => {
    // Validate that both compulsory thoughts are filled
    if (!thought1.trim() || !thought2.trim()) {
      Alert.alert('Error', 'Please enter both Thought 1 and Thought 2 (required)');
      return;
    }

    // Build options array (only include non-empty options)
    const options = [thought1.trim(), thought2.trim()];
    if (thought3.trim()) options.push(thought3.trim());
    if (thought4.trim()) options.push(thought4.trim());

    setLoading(true);
    try {
      const token = await authStorage.getToken();

      if (!token) {
        Alert.alert('Error', 'Please log in to create a poll');
        router.replace('/auth/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.trim() || 'What do you think?',
          options: options,
        }),
      });

      const data = await response.json();
      console.log('Poll created:', data);

      if (response.ok) {
        Alert.alert('Success!', 'Your poll has been posted!', [
          {
            text: 'OK',
            onPress: () => {
              setQuestion('');
              setThought1('');
              setThought2('');
              setThought3('');
              setThought4('');
              setVisibleThoughts(2);
              router.push('/(tabs)');
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to create poll');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.replace('/(tabs)');
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

      {/* User Header with Close Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: getProfileImageUrl() }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#101720" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Input */}
          <View style={styles.inputsContainer}>
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>Question (optional)</Text>
              <TextInput
                style={styles.thoughtInput}
                value={question}
                onChangeText={setQuestion}
                placeholder="What do you want to ask?"
                placeholderTextColor="#6C7278"
                multiline={true}
              />
            </View>

            {/* Thought 1 - Always visible (Required) */}
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>
                Thought 1 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.thoughtInput}
                value={thought1}
                onChangeText={setThought1}
                placeholder="First thought"
                placeholderTextColor="#6C7278"
                multiline={true}
              />
            </View>

            {/* Thought 2 - Always visible (Required) */}
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>
                Thought 2 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.thoughtInput}
                value={thought2}
                onChangeText={setThought2}
                placeholder="Second thought"
                placeholderTextColor="#6C7278"
              />
            </View>

            {/* Thought 3 - Show if visibleThoughts >= 3 */}
            {visibleThoughts >= 3 && (
              <View style={styles.thoughtBox}>
                <Text style={styles.thoughtLabel}>Thought 3</Text>
                <TextInput
                  style={styles.thoughtInput}
                  value={thought3}
                  onChangeText={setThought3}
                  placeholder="Third thought (optional)"
                  placeholderTextColor="#6C7278"
                />
              </View>
            )}

            {/* Thought 4 - Show if visibleThoughts >= 4 */}
            {visibleThoughts >= 4 && (
              <View style={styles.thoughtBox}>
                <Text style={styles.thoughtLabel}>Thought 4</Text>
                <TextInput
                  style={styles.thoughtInput}
                  value={thought4}
                  onChangeText={setThought4}
                  placeholder="Fourth thought (optional)"
                  placeholderTextColor="#6C7278"
                />
              </View>
            )}
          </View>

          {/* Post Button with Gradient */}
          <TouchableOpacity
            onPress={handlePost}
            style={styles.postButtonContainer}
            disabled={loading}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0)']}
              style={styles.postButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Add Thoughts Button - Show when less than 4 thoughts visible */}
          {visibleThoughts < 4 && (
            <TouchableOpacity
              onPress={handleAddThought}
              style={styles.addThoughtButton}
            >
              <Plus size={20} color="#4098D2" />
              <Text style={styles.addThoughtText}>
                Add Thought {visibleThoughts + 1}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#101720',
  },
  closeButton: {
    padding: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  inputsContainer: {
    gap: 20,
  },
  thoughtBox: {
    gap: 8,
  },
  thoughtLabel: {
    fontSize: 14,
    color: '#101720',
    fontWeight: '500',
  },
  required: {
    color: '#FF4444',
    fontSize: 14,
  },
  thoughtInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#101720',
    height: 100,
    textAlignVertical: 'top',
  },
  postButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  postButton: {
    backgroundColor: '#4098D2',
    paddingVertical: 14,
    paddingHorizontal: 100,
    alignItems: 'center',
    borderRadius: 8,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addThoughtButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderWidth: 1,
    borderColor: '#4098D2',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  addThoughtText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4098D2',
  },
});


