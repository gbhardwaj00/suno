const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Scheduled function: runs daily at midnight UTC
exports.dailyPhotoPicker = functions.scheduler.onSchedule("every 5 minutes",
    async (event) => {
      const now = admin.firestore.Timestamp.now();
      const yesterday = admin.firestore.Timestamp.fromMillis(
          now.toMillis() - 24 * 60 * 60 * 1000,
      );

      try {
        const snapshot = await db
            .collection("uploads")
            .where("timestamp", ">=", yesterday)
            .get();

        const allPhotos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (allPhotos.length === 0) {
          console.log("No uploads in the past 24 hours.");
          return;
        }

        const chosen = allPhotos[Math.floor(Math.random() * allPhotos.length)];

        await db.collection("dailyPhoto").doc("current").set({
          url: chosen.imageUrl,
          caption: chosen.caption || "",
          location: chosen.location || "",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Chosen photo: ${chosen.id}`);
      } catch (error) {
        console.error("Error selecting daily photo:", error);
      }
    },
);
