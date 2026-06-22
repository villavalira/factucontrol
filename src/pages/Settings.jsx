import { useState } from "react";
import { auth, db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
export default function Settings() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploadLogo = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("No hay usuario autenticado");
      return;
    }
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }
    setLoading(true);
    try {
      const storage = getStorage();

      // nombre único para evitar cache y sobrescritura
      const fileName = `${Date.now()}-${file.name}`;
      const logoRef = ref(storage, `logos/${user.uid}/${fileName}`);

      // subir archivo
      await uploadBytes(logoRef, file);

      // obtener URL pública
      const url = await getDownloadURL(logoRef);

      // guardar en Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          logoUrl: url,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
      alert("Logo subido correctamente 👍");
      setFile(null);
    } catch (error) {
      console.error("Error subiendo logo:", error);
      alert("Error al subir el logo");
    }
    setLoading(false);
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Configuración</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />
      <button onClick={uploadLogo} disabled={loading}>
        {loading ? "Subiendo..." : "Subir logo"}
      </button>
    </div>
  );
}
