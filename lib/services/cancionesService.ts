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
  serverTimestamp,
} from "firebase/firestore";

export interface Cancion {
  id: string;
  titulo: string;
  artista: string;
  spotifyUrl: string;
  fraseDestacada?: string; // Fragmento o estrofa que se quiere resaltar
  momento?: string; // Ej: "01:24" o contexto ("Nuestro primer baile")
  dedicatoria?: string; // Mensaje personal ("Me recordó a ti cuando...")
  fecha?: string; // ISO String YYYY-MM-DD
  createdAt?: any;
}

const COLLECTION_NAME = "canciones";

export const cancionesService = {
  // Obtener todas las canciones ordenadas
  getAll: async (): Promise<Cancion[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Cancion[];
    } catch (error) {
      console.warn("Fallo con orderBy(fecha), intentando getDocs simple:", error);
      // Fallback si la colección no tiene índice o no todos tienen fecha
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Cancion[];
      return items.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
    }
  },

  // Agregar canción
  add: async (cancion: Omit<Cancion, "id">): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...cancion,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding song:", error);
      throw error;
    }
  },

  // Actualizar canción
  update: async (id: string, cancion: Partial<Cancion>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, cancion);
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  },

  // Eliminar canción
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  },
};

