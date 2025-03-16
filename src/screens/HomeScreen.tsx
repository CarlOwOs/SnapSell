// import react native
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface HomeScreenProps {
  onUploadPress?: () => void;
  onNotificationsPress?: () => void;
}

interface Item {
  id: string;
  title: string;
  image: any; // Changed type to any to accommodate require statements
}

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Vélo vintage',
    image: require('/Users/carloshurtado/Documents/epfl/marker_place/on_sale/1.jpeg'),
  },
  {
    id: '2',
    title: 'Table basse',
    image: require('/Users/carloshurtado/Documents/epfl/marker_place/on_sale/2.jpg'),
  },
  // Note: This third item will only work if you add a file named '3.jpg' or '3.jpeg' to the on_sale folder
  // If the file doesn't exist, this item won't be shown in the list
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onUploadPress, onNotificationsPress }) => {
  const [items, setItems] = useState(mockItems);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Marketplace</Text>
      
      <TouchableOpacity 
        style={styles.notificationBox} 
        onPress={onNotificationsPress}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>Notifications</Text>
          <Text style={styles.notificationIcon}>→</Text>
        </View>
      </TouchableOpacity>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={onUploadPress}>
        <Text style={styles.uploadButtonText}>Upload New Item</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  notificationBox: {
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  notificationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationIcon: {
    fontSize: 18,
    color: '#2E8B57',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  itemInfo: {
    padding: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  itemDescription: {
    color: '#666',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 