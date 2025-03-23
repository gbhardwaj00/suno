import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, Button, Image, Text, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User UID:', user.uid); // ✅ Always logs correctly
        // You can now safely upload/fetch data
      } else {
        console.log('No user signed in.');
      }
    });
  
    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setUploading(true);
    try {
      // Upload to storage
      const response = await fetch(image);
      const blob = await response.blob();
      const fileName = `uploads/${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      console.log("Upload to storage successful");
    
      // Save metadata to Firestore
      await addDoc(collection(db, 'uploads'), {
        imageUrl: downloadURL,
        caption,
        location,
        timestamp: serverTimestamp(),
        userId: auth.currentUser?.uid || 'unknown',
      });
      console.log("Metadata saved to Firestore");
    
      alert("Upload successful!");
      setImage(null);
      setCaption('');
      setLocation('');
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
    
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an Image" onPress={pickImage} />
      <TextInput
        placeholder="Enter a caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />

      <TextInput
        placeholder="Location (optional)"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit Photo" onPress={uploadImage} disabled={!image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '90%', height: 300, marginBottom: 10 },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
