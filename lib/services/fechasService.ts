import {
    collection,
    addDoc,
    getDocs,
    getDoc,
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

export interface FechaEspecial {
    id: string;
    fecha: string; // YYYY-MM-DD
    titulo: string;
    descripcion_m: string;
    descripcion_d: string;
    foto?: string;
    imageRef?: string; // Para borrar la imagen de storage
    createdAt?: Date;
}

const COLLECTION_NAME = 'fechas';

export const fechasService = {
    /**
     * Obtener todas las fechas especiales
     */
    async getAll(): Promise<FechaEspecial[]> {
        try {
            // Ordenamos por fecha del evento, no por creación
            const q = query(collection(db, COLLECTION_NAME), orderBy('fecha', 'desc'));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    fecha: data.fecha,
                    titulo: data.titulo,
                    descripcion_m: data.descripcion_m,
                    descripcion_d: data.descripcion_d,
                    foto: data.foto,
                    imageRef: data.imageRef,
                    createdAt: data.createdAt?.toDate(),
                };
            });
        } catch (error) {
            console.error('Error getting fechas:', error);
            throw error;
        }
    },

    /**
     * Agregar una nueva fecha especial
     */
    async add(
        data: Omit<FechaEspecial, 'id' | 'foto' | 'imageRef' | 'createdAt'>,
        imageFile: File | null
    ): Promise<string> {
        try {
            let foto = '';
            let imageRef = '';

            if (imageFile) {
                const timestamp = Date.now();
                const fileName = `${timestamp}_${imageFile.name}`;
                const storagePath = `fechas/${fileName}`;

                const storageRef = ref(storage, storagePath);
                const uploadResult = await uploadBytes(storageRef, imageFile);
                foto = await getDownloadURL(uploadResult.ref);
                imageRef = storagePath;
            }

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                foto,
                imageRef,
                createdAt: Timestamp.now(),
            });

            console.log('Fecha added successfully:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding fecha:', error);
            throw error;
        }
    },

    /**
     * Actualizar una fecha existente
     */
    async update(
        id: string,
        data: Partial<Omit<FechaEspecial, 'id' | 'createdAt'>>,
        newImageFile?: File | null
    ): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const updateData: any = { ...data };

            if (newImageFile) {
                // 1. Get current doc to find old image
                try {
                    const currentDoc = await getDoc(docRef);
                    if (currentDoc.exists()) {
                        const oldData = currentDoc.data();
                        if (oldData.imageRef) {
                            // 2. Delete old image
                            const oldStorageRef = ref(storage, oldData.imageRef);
                            await deleteObject(oldStorageRef).catch(err =>
                                console.warn('Could not delete old image, might not exist:', err)
                            );
                        }
                    }
                } catch (readError) {
                    console.error("Error reading current doc for image cleanup:", readError);
                }

                // 3. Upload new image
                const timestamp = Date.now();
                const fileName = `${timestamp}_${newImageFile.name}`;
                const storagePath = `fechas/${fileName}`;

                const storageRef = ref(storage, storagePath);
                const uploadResult = await uploadBytes(storageRef, newImageFile);
                updateData.foto = await getDownloadURL(uploadResult.ref);
                updateData.imageRef = storagePath;
            }
            await updateDoc(docRef, updateData);
            console.log('Fecha updated successfully:', id);
        } catch (error) {
            console.error('Error updating fecha:', error);
            throw error;
        }
    },

    /**
     * Eliminar una fecha y su foto
     */
    async delete(id: string, imageRef?: string): Promise<void> {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));

            if (imageRef) {
                try {
                    const storageReference = ref(storage, imageRef);
                    await deleteObject(storageReference);
                } catch (storageError) {
                    console.warn('Error deleting image from storage (might not exist):', storageError);
                }
            }

            console.log('Fecha deleted successfully:', id);
        } catch (error) {
            console.error('Error deleting fecha:', error);
            throw error;
        }
    }
};
