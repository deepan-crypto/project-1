import { useState } from 'react';
import API_BASE_URL from '@/config/api';
import { authStorage } from '@/utils/authStorage';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePickImage = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission required', 'You need to allow access to your photos to change your profile picture.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images' as any,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Get token from storage
            const token = await authStorage.getToken();

            if (!token) {
                Alert.alert('Error', 'Please log in to update your profile');
                router.replace('/auth/login');
                return;
            }

            const formData = new FormData();

            // Add text fields if they have values
            if (fullName.trim()) formData.append('fullName', fullName.trim());
            if (username.trim()) formData.append('username', username.trim());
            if (bio.trim()) formData.append('bio', bio.trim());

            // Add image if selected
            if (profileImage) {
                const filename = profileImage.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('profilePicture', {
                    uri: profileImage,
                    name: filename,
                    type,
                } as any);
            }

            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                router.back();
            } else {
                Alert.alert('Error', data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    const displayImage = profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with Close Button */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile edit</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color="#101720" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Image Section */}
                <View style={styles.profileImageSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: displayImage }}
                            style={styles.profileImage}
                        />
                    </View>
                    <TouchableOpacity onPress={handlePickImage}>
                        <Text style={styles.changePhotoText}>Change profile picture</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#101720',
    },
    closeButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    profileImageSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    profileImageContainer: {
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 3,
        borderColor: '#4098D2',
        padding: 2,
        marginBottom: 12,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: '#E0E0E0',
    },
    changePhotoText: {
        color: '#4098D2',
        fontSize: 14,
        fontWeight: '600',
    },
    form: {
        gap: 24,
        marginBottom: 32,
        width: '100%',
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: '#101720',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#101720',
        backgroundColor: '#FFFFFF',
        height: 44,
    },
    bioInput: {
        height: 120,
        paddingTop: 12,
    },
    saveButton: {
        backgroundColor: '#4098D2',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        width: '100%',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

