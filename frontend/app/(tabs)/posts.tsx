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
} from 'react-native';
import { X } from 'lucide-react-native';

export default function PostsScreen() {
  const [mainThought, setMainThought] = useState('');
  const [thought1, setThought1] = useState('');
  const [thought2, setThought2] = useState('');
  const [thought3, setThought3] = useState('');

  const handlePost = () => {
    setMainThought('');
    setThought1('');
    setThought2('');
    setThought3('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <Text style={styles.userName}>Abigail</Text>
          </View>
          <TouchableOpacity>
            <X size={24} color="#000" />
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
          <TextInput
            style={styles.mainInput}
            value={mainThought}
            onChangeText={setMainThought}
            placeholder="Say something!"
            placeholderTextColor="#999"
            multiline
          />

          <View style={styles.thoughtsContainer}>
            <View style={styles.thoughtInput}>
              <Text style={styles.thoughtLabel}>Thought 1</Text>
              <TextInput
                style={styles.input}
                value={thought1}
                onChangeText={setThought1}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.thoughtInput}>
              <Text style={styles.thoughtLabel}>Thought 2</Text>
              <TextInput
                style={styles.input}
                value={thought2}
                onChangeText={setThought2}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.thoughtInput}>
              <Text style={styles.thoughtLabel}>Thought 3</Text>
              <TextInput
                style={styles.input}
                value={thought3}
                onChangeText={setThought3}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  mainInput: {
    fontSize: 16,
    color: '#000',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    minHeight: 80,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  thoughtsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  thoughtInput: {
    gap: 8,
  },
  thoughtLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  postButton: {
    backgroundColor: '#45BFD0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
