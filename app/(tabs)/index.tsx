import '../../firebaseConfig';
import { useAnonymousAuth } from '../hooks/useAnonymousAuth';


import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useAnonymousAuth();

  useEffect(() => {
    const fetchDailyPhoto = async () => {
      const photoDoc = await getDoc(doc(db, 'dailyPhoto', 'current'));
      if (photoDoc.exists()) {
        setPhotoUrl(photoDoc.data().url);
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
        <Image source={{ uri: photoUrl }} style={styles.image} />
      ) : (
        <Text>No photo selected for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '90%', height: 400, borderRadius: 10 },
});
