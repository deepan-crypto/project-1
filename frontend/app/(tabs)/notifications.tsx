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
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { authStorage } from '@/utils/authStorage';
import { useSocket } from '@/utils/useSocket';
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
  createdAt: string;
}

interface GroupedNotifications {
  [key: string]: Notification[];
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Socket connection for real-time updates
  const { socket, isConnected } = useSocket();

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

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      console.log('Received real-time notification:', notification);
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

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

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
    const grouped: GroupedNotifications = {};
    const now = new Date();

    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      const diffTime = Math.abs(now.getTime() - notifDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let label = '';
      if (diffDays === 0) {
        label = 'Today';
      } else if (diffDays === 1) {
        label = 'Yesterday';
      } else if (diffDays <= 7) {
        label = 'This week';
      } else if (diffDays <= 30) {
        label = 'This month';
      } else {
        label = 'Earlier';
      }

      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(notification);
    });

    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);
  const sectionOrder = ['Today', 'Yesterday', 'This week', 'This month', 'Earlier'];

  const renderFollowRequestActions = (notification: Notification) => {
    if (notification.type !== 'follow_request' || !notification.followRequestId) {
      return null;
    }

    const isLoading = actionLoading === notification.id;

    if (notification.followRequestStatus === 'accepted') {
      return (
        <View style={styles.actionButtons}>
          <View style={styles.acceptedButton}>
            <Text style={styles.acceptedButtonText}>Accepted</Text>
          </View>
        </View>
      );
    }

    if (notification.followRequestStatus === 'rejected') {
      return (
        <View style={styles.actionButtons}>
          <View style={styles.rejectedButton}>
            <Text style={styles.rejectedButtonText}>Declined</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => handleAcceptRequest(notification.followRequestId!, notification.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.followButtonText}>Accept</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleRejectRequest(notification.followRequestId!, notification.id)}
          disabled={isLoading}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Format short time (6m, 2h, 1d)
  const formatShortTime = (timeString: string): string => {
    // timeString is already formatted like "37 minutes ago"
    const parts = timeString.split(' ');
    if (parts.length >= 2) {
      const value = parts[0];
      const unit = parts[1];

      if (timeString.includes('just now')) return 'now';
      if (unit.startsWith('minute')) return `${value}m`;
      if (unit.startsWith('hour')) return `${value}h`;
      if (unit.startsWith('day')) return `${value}d`;
      if (unit.startsWith('week')) return `${value}w`;
      if (unit.startsWith('month')) return `${value}mo`;
      if (unit.startsWith('year')) return `${value}y`;
    }
    return timeString;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {sectionOrder.map(section => {
            const sectionNotifications = groupedNotifications[section];
            if (!sectionNotifications || sectionNotifications.length === 0) return null;

            return (
              <View key={section}>
                <Text style={styles.sectionHeader}>{section}</Text>
                {sectionNotifications.map((notification, index) => (
                  <View key={notification.id}>
                    <View style={styles.notificationItem}>
                      <Image
                        source={{ uri: getAvatarUrl(notification.user.avatar) }}
                        style={styles.avatar}
                      />
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationText}>
                          <Text style={styles.userName}>{notification.user.name}</Text>
                          {' '}
                          <Text style={styles.actionText}>
                            {notification.action.replace(notification.user.username, '').trim()}
                          </Text>
                          {' '}
                          <Text style={styles.timestamp}>· {formatShortTime(notification.time)}</Text>
                        </Text>
                        {renderFollowRequestActions(notification)}
                      </View>
                    </View>
                    {index < sectionNotifications.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            );
          })}
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
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
    color: '#000000',
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
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    lineHeight: 20,
  },
  userName: {
    fontWeight: '600',
    color: '#000000',
  },
  actionText: {
    color: '#000000',
  },
  timestamp: {
    color: '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 68,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  followButton: {
    backgroundColor: '#458FD0',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptedButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  acceptedButtonText: {
    color: '#6C7278',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectedButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  rejectedButtonText: {
    color: '#6C7278',
    fontSize: 14,
    fontWeight: '600',
  },
});
