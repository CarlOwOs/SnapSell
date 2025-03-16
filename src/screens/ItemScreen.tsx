import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  HomeList: undefined;
  ItemDetails: { id: string };
};

type ItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ItemDetails'>;
type ItemScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetails'>;

// Mock data function - in a real app, you would fetch this from your database
function getItemById(id: string) {
  const items = [
    {
      id: "1",
      title: "Vintage Leather Chair",
      description:
        "Genuine leather chair in excellent condition. Minimal wear. This chair has been in my family for over 5 years but is still in great shape. The leather is soft and there are no tears or major scratches. Pickup only from downtown area.",
      price: 120,
      image: "https://via.placeholder.com/400",
      seller: "John Doe",
      createdAt: "2 days ago",
      location: "Downtown",
    },
    {
      id: "2",
      title: "Mountain Bike",
      description:
        "Barely used mountain bike, perfect for trails and city riding. Bought this bike last summer but only used it a handful of times. It's a 21-speed with disc brakes and front suspension. The frame is aluminum and it has 27.5 inch wheels. Looking to sell as I'm moving to a smaller apartment.",
      price: 250,
      image: "https://via.placeholder.com/400",
      seller: "Jane Smith",
      createdAt: "5 days ago",
      location: "West Side",
    },
    {
      id: "3",
      title: "Coffee Table",
      description:
        "Solid wood coffee table with storage underneath. This beautiful coffee table is made from solid oak and features a shelf underneath for storage. The dimensions are 120cm x 60cm x 45cm (LxWxH). It has some minor scratches on the surface but is otherwise in excellent condition.",
      price: 75,
      image: "https://via.placeholder.com/400",
      seller: "Mike Johnson",
      createdAt: "1 week ago",
      location: "North End",
    },
  ];

  return items.find((item) => item.id === id);
}

export default function ItemScreen() {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const route = useRoute<ItemScreenRouteProp>();
  const id = route.params.id;
  const item = getItemById(id);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Item not found</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Marketplace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#666" />
        <Text style={styles.backButtonText}>Back to Marketplace</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price} €</Text>
          <Text style={styles.metadata}>
            {item.location} · {item.createdAt}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.sellerSection}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View>
              <Text style={styles.sellerName}>{item.seller}</Text>
              <Text style={styles.sellerLabel}>Seller</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metadata: {
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    lineHeight: 24,
  },
  sellerSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sellerName: {
    fontWeight: '500',
  },
  sellerLabel: {
    color: '#666',
    fontSize: 12,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
}); 