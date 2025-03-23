import '../../firebaseConfig';
import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchDailyPhoto = async () => {
      try {
        const docRef = doc(db, 'dailyPhoto', 'current');
        const photoDoc = await getDoc(docRef);
        
        if (photoDoc.exists()) {
          const data = photoDoc.data();
          console.log("Fetched daily photo:", data); // 🧪 log here
          setPhotoUrl(data.url);
          setCaption(data.caption || '');
          setLocation(data.location || '');
        } else {
          console.log("No daily photo found.");
        }
      } catch (error) {
        console.error("Error fetching daily photo:", error);
      }
      
      setLoading(false);
    };
    fetchDailyPhoto();
  }, []);
  
  return (
    <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : photoUrl ? (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: `${photoUrl}?t=${Date.now()}` }}
          style={styles.image}
        />
        {caption ? (
          <Text style={styles.caption}>{caption}</Text>
        ) : null}
        {location ? (
          <Text style={styles.location}>📍 {location}</Text>
        ) : null}
      </View>
    ) : (
      <Text>No photo selected for today.</Text>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  image: { 
    width: '90%', 
    height: 400, 
    borderRadius: 10 
  },
  caption: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
    textAlign: 'center',
  },
});
