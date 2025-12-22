import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff } from 'lucide-react-native';
import API_BASE_URL from '@/config/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Verify token exists
    if (!token) {
      Alert.alert(
        'Invalid Link',
        'This password reset link is invalid. Please request a new one.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    }
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleUpdatePassword = async () => {
    // Clear errors
    setErrors({});

    // Validate
    if (!newPassword.trim()) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      return;
    }

    if (!confirmPassword.trim()) {
      setErrors({ confirmPassword: 'Please confirm your password' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. You can now log in with your new password.',
          [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
        );
      } else {
        setErrors({
          general: data.message || 'Failed to reset password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({
        general: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#45BFD0', '#2B9EB3']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Reset Account Password</Text>

            <View style={styles.form}>
              {errors.general && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Create New Password</Text>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                />
                {errors.newPassword && <Text style={styles.fieldError}>{errors.newPassword}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#999" />
                    ) : (
                      <Eye size={20} color="#999" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.updateButton, loading && styles.updateButtonDisabled]}
                onPress={handleUpdatePassword}
                disabled={loading}
              >
                <Text style={styles.updateButtonText}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 14,
  },
  updateButton: {
    backgroundColor: '#45BFD0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  fieldError: {
    color: '#c62828',
    fontSize: 12,
    marginTop: 4,
  },
  inputError: {
    borderColor: '#c62828',
    borderWidth: 1,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
});
