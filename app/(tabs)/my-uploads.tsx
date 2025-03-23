import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, ActivityIndicator, StyleSheet, Dimensions, Button} from 'react-native';
import { db } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Platform } from 'react-native';


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
    const [refreshing, setRefreshing] = useState(false);
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

    const handleRefresh = async () => {
        setRefreshing(true);
        const uid = auth.currentUser?.uid;
        if (uid) {
          await fetchUploads(uid);
        }
        setRefreshing(false);
    };

      
    const fetchUploads = async (uid: string) => {
        try {
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
        } catch (error) {
          console.error('Error fetching uploads:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setLoading(false); // No user signed in — stop loading
                return;
            }
            console.log('Current user UID:', auth.currentUser?.uid);
        await fetchUploads(user.uid);
        setLoading(false);
        });

        return () => unsubscribe();
    }, []);
      

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 20 }}>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View>
            {Platform.OS === 'web' && (
                <View style={{ marginTop: 10 }}>
                    <Button title="Refresh My Uploads" onPress={handleRefresh} />
                </View>
            )}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : photos.length > 0 ? (
                <FlatList
                data={photos}
                numColumns={1}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true);
                    await fetchUploads(auth.currentUser?.uid || '');
                    setRefreshing(false);
                }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Image source={{ uri: item.imageUrl }} style={styles.image} />
                      {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
                      {item.location && <Text style={styles.location}>📍 {item.location}</Text>}
                    </View>
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
        width: screenWidth - 40, // Full width with padding/margins
        height: 250,
        borderRadius: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        padding: 10,
      },
      caption: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
      },
      location: {
        fontSize: 12,
        color: 'gray',
      },      
});
