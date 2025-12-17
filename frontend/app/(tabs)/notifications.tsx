import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { authStorage } from '@/utils/authStorage';
import API_BASE_URL from '@/config/api';

interface Notification {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  action: string;
  time: string;
  read: boolean;
  type: string;
  followRequestId?: string;
  followRequestStatus?: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const token = await authStorage.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleAcceptRequest = async (followRequestId: string, notificationId: string) => {
    setActionLoading(notificationId);
    try {
      const token = await authStorage.getToken();
      const response = await fetch(`${API_BASE_URL}/users/follow-request/${followRequestId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update notification in state
        setNotifications(notifications.map(n =>
          n.id === notificationId
            ? { ...n, followRequestStatus: 'accepted' }
            : n
        ));
        Alert.alert('Success', 'Follow request accepted');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (followRequestId: string, notificationId: string) => {
    setActionLoading(notificationId);
    try {
      const token = await authStorage.getToken();
      const response = await fetch(`${API_BASE_URL}/users/follow-request/${followRequestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update notification in state
        setNotifications(notifications.map(n =>
          n.id === notificationId
            ? { ...n, followRequestStatus: 'rejected' }
            : n
        ));
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) {
      return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';
    }
    if (avatar.startsWith('http')) {
      return avatar;
    }
    return `${API_BASE_URL.replace('/api', '')}${avatar}`;
  };

  const renderFollowRequestActions = (notification: Notification) => {
    if (notification.type !== 'follow_request' || !notification.followRequestId) {
      return null;
    }

    const isLoading = actionLoading === notification.id;

    if (notification.followRequestStatus === 'accepted') {
      return (
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Accepted</Text>
        </View>
      );
    }

    if (notification.followRequestStatus === 'rejected') {
      return (
        <View style={[styles.statusBadge, styles.rejectedBadge]}>
          <Text style={[styles.statusBadgeText, styles.rejectedText]}>Declined</Text>
        </View>
      );
    }

    return (
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(notification.followRequestId!, notification.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.acceptButtonText}>Accept</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleRejectRequest(notification.followRequestId!, notification.id)}
          disabled={isLoading}
        >
          <Text style={styles.rejectButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.logoHeader}>
        <Image
          source={require('../../assets/images/ican.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#458FD0" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>When someone interacts with you, you'll see it here</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Image
                source={{ uri: getAvatarUrl(notification.user.avatar) }}
                style={styles.avatar}
              />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>
                  <Text style={styles.userName}>{notification.user.name}</Text>
                  {' '}
                  {notification.action.replace(notification.user.username, '').trim()}
                </Text>
                <Text style={styles.time}>{notification.time}</Text>
                {renderFollowRequestActions(notification)}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#101720',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101720',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C7278',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: '#687684',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: '#101720',
  },
  time: {
    fontSize: 12,
    color: '#6C7278',
  },
  requestActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#458FD0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#6C7278',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusBadgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
  },
  rejectedText: {
    color: '#C62828',
  },
});
