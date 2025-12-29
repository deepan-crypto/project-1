import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { authStorage } from './authStorage';
import API_BASE_URL from '@/config/api';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Custom hook for managing push notifications
 */
export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
    const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

    useEffect(() => {
        // Register for push notifications
        registerForPushNotificationsAsync().then(async token => {
            if (token) {
                setExpoPushToken(token);
                // Register token with backend
                await registerTokenWithBackend(token);
            }
        });

        // Listen for notifications received while app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('Notification received in foreground:', notification);
        });

        // Listen for notification taps
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification tapped:', response);
            handleNotificationResponse(response);
        });

        // Create Android notification channel
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#458FD0',
            });
        }

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    return {
        expoPushToken,
        notification,
    };
};

/**
 * Register for push notifications and get token
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    try {
        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Ask for permission if not granted
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // If permission denied, return null
        if (finalStatus !== 'granted') {
            console.log('Permission for push notifications denied');
            return null;
        }

        // Get the Expo push token
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
            console.warn('Project ID not found. Push notifications may not work properly.');
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);

    } catch (error) {
        console.error('Error getting push token:', error);
    }

    return token;
}

/**
 * Register push token with backend
 */
async function registerTokenWithBackend(pushToken: string): Promise<void> {
    try {
        const token = await authStorage.getToken();
        const user = await authStorage.getUser();

        if (!token || !user) {
            console.log('User not logged in, skipping token registration');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/users/register-push-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ pushToken }),
        });

        if (response.ok) {
            console.log('Push token registered with backend successfully');
        } else {
            const data = await response.json();
            console.error('Failed to register push token:', data.message);
        }
    } catch (error) {
        console.error('Error registering push token with backend:', error);
    }
}

/**
 * Handle notification tap to navigate to relevant screen
 */
function handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;

    // TODO: Add navigation logic based on notification type
    // For now, just log the data
    console.log('Notification data:', data);

    // Example navigation logic (you'll need to import and use router):
    // if (data.type === 'poll_like' || data.type === 'poll_vote') {
    //   router.push(`/poll/${data.pollId}`);
    // } else if (data.type === 'follow_request' || data.type === 'follow') {
    //   router.push('/notifications');
    // }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
}
