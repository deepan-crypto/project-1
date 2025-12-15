import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

const mockNotifications = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    action: 'liked your poll',
    time: '2 hours ago',
  },
  {
    id: '2',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    action: 'voted on your poll',
    time: '5 hours ago',
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    action: 'started following you',
    time: '1 day ago',
  },
  {
    id: '4',
    user: {
      name: 'Alex Turner',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    action: 'commented on your poll',
    time: '2 days ago',
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.logoHeader}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notificationCard}>
            <Image
              source={{ uri: notification.user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{notification.user.name}</Text>
                {' '}
                {notification.action}
              </Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  logoHeader: {
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 40,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
