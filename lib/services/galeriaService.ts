import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
    query,
    orderBy
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface GaleriaItem {
    id?: string;
    titulo: string;
    imageUrl: string;
    imageRef: string; // Storage reference path for deletion
    userId: string;
    createdAt: Date;
    fileSize?: number; // Size in bytes
    originalFileName?: string;
}

const COLLECTION_NAME = 'galeria';

export const galeriaService = {
    /**
     * Get all gallery items, ordered by creation date (newest first)
     */
    async getAll(): Promise<GaleriaItem[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    titulo: data.titulo,
                    imageUrl: data.imageUrl,
                    imageRef: data.imageRef,
                    userId: data.userId,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    fileSize: data.fileSize,
                    originalFileName: data.originalFileName,
                };
            });
        } catch (error) {
            console.error('Error getting gallery items:', error);
            throw error;
        }
    },

    /**
     * Add a new gallery item with image upload to Storage
     * @param titulo - Title/caption for the image
     * @param imageFile - Optimized image file (preferably WebP)
     * @param userId - ID of the user uploading the image
     */
    async add(titulo: string, imageFile: File, userId: string): Promise<string> {
        try {
            // Generate unique filename with timestamp
            const timestamp = Date.now();
            const fileName = `${timestamp}_${imageFile.name}`;
            const storagePath = `galeria/${userId}/${fileName}`;

            // Upload image to Storage
            const storageRef = ref(storage, storagePath);
            const uploadResult = await uploadBytes(storageRef, imageFile);

            // Get download URL
            const imageUrl = await getDownloadURL(uploadResult.ref);

            // Add document to Firestore
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                titulo,
                imageUrl,
                imageRef: storagePath,
                userId,
                createdAt: Timestamp.now(),
                fileSize: imageFile.size,
                originalFileName: imageFile.name,
            });

            console.log('Gallery item added successfully:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding gallery item:', error);
            throw error;
        }
    },

    /**
     * Update the title of an existing gallery item
     * @param id - Document ID
     * @param titulo - New title
     */
    async updateTitle(id: string, titulo: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, { titulo });
            console.log('Gallery item updated successfully:', id);
        } catch (error) {
            console.error('Error updating gallery item:', error);
            throw error;
        }
    },

    /**
     * Delete a gallery item from both Firestore and Storage
     * @param id - Document ID
     * @param imageRef - Storage reference path
     */
    async delete(id: string, imageRef: string): Promise<void> {
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, COLLECTION_NAME, id));

            // Delete from Storage
            try {
                const storageReference = ref(storage, imageRef);
                await deleteObject(storageReference);
                console.log('Image deleted from storage:', imageRef);
            } catch (storageError) {
                console.error('Error deleting image from storage:', storageError);
                // Continue even if storage deletion fails (image might not exist)
            }

            console.log('Gallery item deleted successfully:', id);
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            throw error;
        }
    },
};
