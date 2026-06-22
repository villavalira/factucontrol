import { useState } from "react";
import { auth, db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function Settings() {
  const [file, setFile] = useState(null);

  const uploadLogo = async () => {
    if (!file) return;

    const storage = getStorage();

    // 1. Crear referencia única por usuario
    const logoRef = ref(storage, `logos/${auth.currentUser.uid}`);

    // 2. Subir imagen
    await uploadBytes(logoRef, file);

    // 3. Obtener URL pública
    const url = await getDownloadURL(logoRef);

    // 4. Guardar en Firestore (perfil usuario)
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        logoUrl: url,
      },
      { merge: true }
    );

    alert("Logo guardado correctamente 👍");
  };

  return (
    <div>
      <h1>Configuración</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadLogo}>
        Subir logo
      </button>
    </div>
  );
}
