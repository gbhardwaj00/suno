import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, ActivityIndicator, StyleSheet, Dimensions, Button} from 'react-native';
import { db } from '../../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

type Upload = {
    id: string;
    imageUrl: string;
    caption?: string;
    location?: string;
  };
  

export default function MyUploadsScreen() {
    const [photos, setPhotos] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(true);
    
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          alert('Signed out. You’ve been assigned a new anonymous user ID.');
        } catch (error) {
          console.error('Error signing out:', error);
          alert('Sign out failed');
        }
    };

    useEffect(() => {
        const fetchUserPhotos = async () => {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(
            collection(db, 'uploads'),
            where('userId', '==', uid),
            orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        const uploads = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              imageUrl: data.imageUrl,
              caption: data.caption,
              location: data.location,
            } satisfies Upload;
          });
        setPhotos(uploads);
        setLoading(false);
        };

        fetchUserPhotos();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 20 }}>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : photos.length > 0 ? (
                <FlatList
                data={photos}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                )}
                />
            ) : (
                <Text>You haven’t uploaded anything yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    image: {
        width: screenWidth / 2 - 20,
        height: screenWidth / 2 - 20,
        margin: 5,
        borderRadius: 10,
    },
});
