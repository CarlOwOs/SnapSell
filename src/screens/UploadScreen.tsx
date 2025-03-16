import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface UploadScreenProps {
  onBackPress: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onBackPress }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // Request media library permissions
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions pour accéder à vos photos!');
      }
      
      // Request camera permissions
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions pour accéder à votre caméra!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      alert('Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      alert('Une erreur est survenue lors de la prise de photo');
    }
  };

  const saveImageToOnSaleFolder = async (imageUri: string): Promise<string> => {
    try {
      const fileExtension = imageUri.split('.').pop();
      const newFileName = `3.${fileExtension}`;
      const onSaleDir = `${FileSystem.documentDirectory}`;
      console.log(onSaleDir);
      const newFilePath = `${onSaleDir}/${newFileName}`;
      
      await FileSystem.copyAsync({
        from: imageUri,
        to: newFilePath
      });
      
      console.log(`Image saved to on_sale folder as ${newFileName}`);
      return newFilePath;
    } catch (error) {
      console.error('Error saving image to on_sale folder:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    try {
      setIsLoading(true);
      
      // Save image to on_sale folder
      const savedImagePath = await saveImageToOnSaleFolder(image);
      console.log('Image saved at:', savedImagePath);
      
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const fileType = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('photo', {
        uri: image,
        name: filename,
        type: fileType,
      } as any);

      // TODO: Remplacer par votre URL d'API
      const response = await fetch('http://128.179.131.122:5001/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      setIsLoading(false);
      alert('Image téléchargée avec succès!');
      onBackPress();
    } catch (error) {
      setIsLoading(false);
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Upload New Item</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
          <Text style={styles.optionButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
          <Text style={styles.optionButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.selectedImage} />
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadArea}>
          <Text style={styles.uploadText}>Please select an image or take a photo</Text>
        </View>
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
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E8B57',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#2E8B57',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  optionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadArea: {
    margin: 16,
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    margin: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#88c4a6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadScreen; 