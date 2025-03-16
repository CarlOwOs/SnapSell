import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  sender: string;
  read: boolean;
}

interface NotificationsScreenProps {
  onBackPress: () => void;
}

const BACKEND_URL = 'http://128.179.131.122:5001';

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBackPress }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = () => {
    try {
      socketRef.current = io(BACKEND_URL);
      
      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
      });
      
      socketRef.current.on('notifications', (data: Notification[]) => {
        console.log('Received all notifications:', data.length);
        setNotifications(data);
        setLoading(false);
      });
      
      socketRef.current.on('new_notification', (notification: Notification) => {
        console.log('Received new notification:', notification);
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        
        // Show an alert for new notifications when the app is open
        Alert.alert(
          notification.title,
          notification.message,
          [{ text: 'OK', onPress: () => markAsRead(notification.id) }]
        );
      });
      
      socketRef.current.on('notification_read', (updatedNotification: Notification) => {
        console.log('Notification marked as read:', updatedNotification.id);
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === updatedNotification.id 
              ? updatedNotification 
              : notification
          )
        );
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
      
      socketRef.current.on('error', (error: any) => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Error connecting to socket:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/notifications/${id}/read`, {
        method: 'PUT',
      });
      
      // The state will be updated via socket event
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
    connectSocket();
    
    return () => {
      // Clean up socket connection when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]} 
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationSender}>From: {item.sender}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E8B57" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No notifications yet</Text>
          <Text style={styles.emptyStateSubtext}>
            You'll see notifications about your items and activity here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2E8B57']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To offset the back button and center the title
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E8B57',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  unreadNotification: {
    backgroundColor: '#f0f9f6',
    borderLeftColor: '#2E8B57',
  },
  readNotification: {
    backgroundColor: '#f9f9f9',
    borderLeftColor: '#ccc',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationSender: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default NotificationsScreen; 