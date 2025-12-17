import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';

export default function SettingsScreen() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = await authStorage.getToken();
            const response = await fetch(`${API_BASE_URL}/users/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok && data.settings) {
                setIsPrivate(data.settings.isPrivate || false);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrivacyToggle = async (value: boolean) => {
        setSaving(true);
        try {
            const token = await authStorage.getToken();
            const response = await fetch(`${API_BASE_URL}/users/settings/privacy`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPrivate: value }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsPrivate(value);
                Alert.alert('Success', value ? 'Your account is now private' : 'Your account is now public');
            } else {
                Alert.alert('Error', data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#101720" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerSpacer} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#458FD0" />
                </View>
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    {/* Privacy Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Privacy</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Private Account</Text>
                                <Text style={styles.settingDescription}>
                                    When your account is private, only people you approve can see your polls and follow you.
                                </Text>
                            </View>
                            <Switch
                                value={isPrivate}
                                onValueChange={handlePrivacyToggle}
                                disabled={saving}
                                trackColor={{ false: '#E0E0E0', true: '#458FD0' }}
                                thumbColor={isPrivate ? '#FFFFFF' : '#FFFFFF'}
                                ios_backgroundColor="#E0E0E0"
                            />
                        </View>
                    </View>
                </ScrollView>
            )}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#101720',
    },
    headerSpacer: {
        width: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6C7278',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101720',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6C7278',
        lineHeight: 18,
    },
});
