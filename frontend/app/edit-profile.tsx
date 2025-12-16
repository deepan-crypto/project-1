import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';

export default function EditProfileScreen() {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const handleSave = () => {
        // Save profile changes
        router.back();
    };

    const handleClose = () => {
        router.back();
    };

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
                            source={{
                                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}>Change profile picture</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder=""
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder=""
                            placeholderTextColor="#666"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
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

