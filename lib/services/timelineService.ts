import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface TimelineEntry {
    id: string;
    fecha: string; // YYYY-MM-DD
    titulo: string;
    descripcion: string; // Unified description for the timeline
    foto?: string; // URL of the image
    imageRef?: string; // Storage path
    fecha_display?: string; // Optional text to show instead of real date (e.g. "Verano 2024")
    userId?: string;
    createdAt?: any;
}

export const timelineService = {
    // Obtener todos los eventos ordenados por fecha
    getAll: async (): Promise<TimelineEntry[]> => {
        try {
            const q = query(collection(db, "timeline"), orderBy("fecha", "asc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TimelineEntry));
        } catch (error) {
            console.error("Error getting timeline:", error);
            throw error;
        }
    },

    // Agregar nuevo evento
    add: async (data: Omit<TimelineEntry, "id">, imageFile?: File) => {
        try {
            let photoUrl = "";
            let imagePath = "";

            if (imageFile) {
                const storageRef = ref(storage, `timeline/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                photoUrl = await getDownloadURL(snapshot.ref);
                imagePath = storageRef.fullPath;
            }

            await addDoc(collection(db, "timeline"), {
                ...data,
                foto: photoUrl,
                imageRef: imagePath,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding timeline entry:", error);
            throw error;
        }
    },

    // Actualizar evento
    update: async (id: string, data: Partial<TimelineEntry>, newImageFile?: File) => {
        try {
            const updateData = { ...data };

            if (newImageFile) {
                // 1. Get current doc to find old image
                try {
                    const currentDoc = await getDoc(doc(db, "timeline", id));
                    if (currentDoc.exists()) {
                        const oldData = currentDoc.data();
                        if (oldData.imageRef) {
                            const oldStorageRef = ref(storage, oldData.imageRef);
                            await deleteObject(oldStorageRef).catch(e => console.warn("Could not delete old image", e));
                        }
                    }
                } catch (readError) {
                    console.error("Error reading doc for image cleanup:", readError);
                }

                // 2. Upload new image
                const storageRef = ref(storage, `timeline/${Date.now()}_${newImageFile.name}`);
                const snapshot = await uploadBytes(storageRef, newImageFile);
                const photoUrl = await getDownloadURL(snapshot.ref);

                updateData.foto = photoUrl;
                updateData.imageRef = storageRef.fullPath;
            }

            const docRef = doc(db, "timeline", id);
            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating timeline entry:", error);
            throw error;
        }
    },

    // Eliminar evento
    delete: async (id: string, imageRef?: string) => {
        try {
            await deleteDoc(doc(db, "timeline", id));

            if (imageRef) {
                const storageRef = ref(storage, imageRef);
                await deleteObject(storageRef).catch(e => console.warn("Image not found or already deleted", e));
            }
        } catch (error) {
            console.error("Error deleting timeline entry:", error);
            throw error;
        }
    }
};
