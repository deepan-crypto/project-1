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
  const [visibleThoughts, setVisibleThoughts] = useState(2);
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

  // Handle question input with character limit
  const handleQuestionChange = (text: string) => {
    if (text.length <= 250) {
      setQuestion(text);
    }
  };

  // Handle thought input with character limit
  const handleThoughtChange = (setter: (text: string) => void, text: string) => {
    if (text.length <= 50) {
      setter(text);
    }
  };

  // Check if post button should be enabled
  const isPostEnabled = () => {
    // Only disable if character limits are exceeded
    const exceedsLimits =
      question.length > 250 ||
      thought1.length > 50 ||
      thought2.length > 50 ||
      thought3.length > 50;

    return !exceedsLimits;
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
    router.back();
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Inputs */}
          <View style={styles.inputsContainer}>
            {/* Poll Question Input - No border */}
            <View>
              <TextInput
                style={styles.questionInput}
                value={question}
                onChangeText={handleQuestionChange}
                placeholder="Say something"
                placeholderTextColor="#6C7278"
                multiline={true}
              />
              {/* Character counter */}
              <View style={styles.counterContainer}>
                <Text
                  style={[
                    styles.counterText,
                    question.length > 200 && styles.counterTextRed
                  ]}
                >
                  {question.length}/250
                </Text>
              </View>
            </View>

            {/* Poll Option 1 - Full width */}
            <View>
              <TextInput
                style={styles.thoughtInput}
                value={thought1}
                onChangeText={(text) => handleThoughtChange(setThought1, text)}
                placeholder="Thought 1"
                placeholderTextColor="#6C7278"
              />
              {thought1.length === 50 && (
                <Text style={styles.maxCharText}>Maximum 50 characters reached</Text>
              )}
            </View>

            {/* Poll Option 2 - Full width */}
            <View>
              <TextInput
                style={styles.thoughtInput}
                value={thought2}
                onChangeText={(text) => handleThoughtChange(setThought2, text)}
                placeholder="Thought 2"
                placeholderTextColor="#6C7278"
              />
              {thought2.length === 50 && (
                <Text style={styles.maxCharText}>Maximum 50 characters reached</Text>
              )}
            </View>

            {/* Poll Option 3 - Full width */}
            <View>
              <TextInput
                style={styles.thoughtInput}
                value={thought3}
                onChangeText={(text) => handleThoughtChange(setThought3, text)}
                placeholder="Thought 3"
                placeholderTextColor="#6C7278"
              />
              {thought3.length === 50 && (
                <Text style={styles.maxCharText}>Maximum 50 characters reached</Text>
              )}
            </View>
          </View>

          {/* Post Button with Gradient */}
          <TouchableOpacity
            onPress={handlePost}
            style={styles.postButtonContainer}
            disabled={loading || !isPostEnabled()}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0)']}
              style={[
                styles.postButton,
                (!isPostEnabled() || loading) && styles.postButtonDisabled
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.postButtonText,
                  (!isPostEnabled()) && styles.postButtonTextDisabled
                ]}>Post</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View >
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 20,
  },
  inputsContainer: {
    gap: 20,
  },
  questionInput: {
    width: 328,
    height: 189,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#101720',
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  questionInputDisabled: {
    backgroundColor: '#F5F5F5',
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  counterText: {
    fontSize: 12,
    color: '#6C7278',
  },
  counterTextRed: {
    color: '#FF0000',
  },
  thoughtInput: {
    width: '100%',
    height: 47,
    borderWidth: 0.5,
    borderColor: '#6C7278',
    borderRadius: 7,
    padding: 12,
    fontSize: 14,
    color: '#101720',
    textAlignVertical: 'top',
  },
  maxCharText: {
    fontSize: 11,
    color: '#FF0000',
    marginTop: 4,
    textAlign: 'right',
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
  postButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#999999',
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
