import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";

export interface Carta {
    id: string;
    titulo: string;
    contenido: string;
    fecha: string; // ISO String YYYY-MM-DD
    remitente?: string;
    destinatario?: string;
    color?: string; // Para personalizar el sobre o carta
}

const COLLECTION_NAME = "cartas";

export const cartasService = {
    // Obtener todas las cartas
    getAll: async (): Promise<Carta[]> => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("fecha", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Carta[];
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    },

    // Agregar nueva carta
    add: async (carta: Omit<Carta, "id">): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), carta);
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    },

    // Actualizar carta
    update: async (id: string, carta: Partial<Carta>): Promise<void> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, carta);
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    },

    // Eliminar carta
    delete: async (id: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    },
};
