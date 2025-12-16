import { useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PostsScreen() {
  const [thought1, setThought1] = useState('');
  const [thought2, setThought2] = useState('');
  const [thought3, setThought3] = useState('');

  const handlePost = () => {
    setThought1('');
    setThought2('');
    setThought3('');
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
              source={{
                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Abigail</Text>
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
          {/* Thought Inputs - No grey container */}
          <View style={styles.inputsContainer}>
            {/* Thought 1 - Main input with "Say something!" placeholder */}
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>Thought 1</Text>
              <TextInput
                style={styles.thoughtInput}
                value={thought1}
                onChangeText={setThought1}
                placeholder="Say something!"
                placeholderTextColor="#6C7278"
                multiline={true}
              />
            </View>

            {/* Thought 2 */}
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>Thought 2</Text>
              <TextInput
                style={styles.thoughtInput}
                value={thought2}
                onChangeText={setThought2}
                placeholder=""
                placeholderTextColor="#6C7278"
              />
            </View>

            {/* Thought 3 */}
            <View style={styles.thoughtBox}>
              <Text style={styles.thoughtLabel}>Thought 3</Text>
              <TextInput
                style={styles.thoughtInput}
                value={thought3}
                onChangeText={setThought3}
                placeholder=""
                placeholderTextColor="#6C7278"
              />
            </View>
          </View>

          {/* Post Button with Gradient */}
          <TouchableOpacity onPress={handlePost} style={styles.postButtonContainer}>
            <LinearGradient
              colors={['#458FD0', '#07F2DF']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.postButton}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101720',
  },
  closeButton: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  // Container for all inputs - no grey background
  inputsContainer: {
    backgroundColor: 'transparent',
    gap: 12,
    marginBottom: 24,
  },
  thoughtBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C7278',
    padding: 12,
    minHeight: 70,
  },
  thoughtLabel: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '500',
    marginBottom: 8,
  },
  thoughtInput: {
    fontSize: 14,
    color: '#101720',
    minHeight: 40,
    textAlignVertical: 'top',
    padding: 0,
  },
  postButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  postButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


