import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/AdminUploadForm.css";

export default function AdminUploadForm() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !title || !description || !selectedOption) {
            toast.warn("Por favor completa todos los campos.");
            return;
        }

        try {
            let fileUrl = null;

            // Subir el archivo al bucket 'uploads' si hay uno
            if (file) {
                const { data: fileData, error: fileError } = await supabase
                    .storage
                    .from("uploads")
                    .upload(`public/${file.name}`, file);

                if (fileError) {
                    console.error("Error al subir archivo al bucket:", fileError);
                    throw fileError;
                }

                fileUrl = supabase.storage
                    .from("uploads")
                    .getPublicUrl(`public/${file.name}`).data.publicUrl;
                console.log("URL pública del archivo:", fileUrl);
            }

            // Insertar el contenido en la tabla `motivational_content`
            const { error } = await supabase
                .from("motivational_content")
                .insert([{ title, description, category: selectedOption, file_url: fileUrl }]);

            if (error) {
                console.error("Error al insertar en la base de datos:", error);
                throw error;
            }

            toast.success("Contenido subido con éxito. ¡Gracias!");
        } catch (error) {
            console.error("Error al subir el contenido:", error.message);
            toast.error("Hubo un error al subir el contenido. Inténtalo nuevamente.");
        }

        // Limpiar el formulario
        setFile(null);
        setTitle("");
        setDescription("");
        setSelectedOption(null);
    };

    const openModal = (option) => {
        setSelectedOption(option);
    };

    const closeModal = () => {
        setSelectedOption(null);
    };

    return (
        <>
            {/* Encabezado */}
            <header
                style={{
                    width: "100%",
                    background: "linear-gradient(to top, #370061 0%, #7f00b2 100%)",
                    padding: "1rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <img
                    src="/images/logo1.png"
                    alt="Logo Active Pulse"
                    style={{
                        height: "100px",
                        marginRight: "1rem",
                    }}
                />
            </header>

            <div className="admin-options-container">
                <h1 className="admin-options-title">¿Qué quieres subir hoy?</h1>
                <div className="admin-options">
                    <button className="admin-option" onClick={() => openModal("Frases Motivacionales")}>
                        <img src="/images/text.png" alt="Frases" className="option-icon" />
                        <span>Frases Motivacionales</span>
                    </button>
                    <button className="admin-option" onClick={() => openModal("Imágenes Motivacionales")}>
                        <img src="/images/image.png" alt="Imágenes" className="option-icon" />
                        <span>Imágenes Motivacionales</span>
                    </button>
                    <button className="admin-option" onClick={() => openModal("Videos Motivacionales")}>
                        <img src="/images/video.png" alt="Videos" className="option-icon" />
                        <span>Videos Motivacionales</span>
                    </button>
                    <button className="admin-option" onClick={() => openModal("Otros")}>
                        <img src="/images/other.png" alt="Otros" className="option-icon" />
                        <span>Otros</span>
                    </button>
                </div>
            </div>

            <div className="background-images">
                <img src="/images/logo3.1.png" alt="Esquina izquierda" className="corner-image left" />
                <img src="/images/logo3.1.png" alt="Esquina derecha" className="corner-image right" />
            </div>

            {selectedOption && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{`Subir ${selectedOption}`}</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Título:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Escribe un título para el contenido"
                                required
                            />

                            <label htmlFor="description">Descripción:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe el contenido"
                                required
                            ></textarea>

                            <label htmlFor="file">Selecciona un archivo:</label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                required
                            />

                            <div className="modal-buttons">
                                <button type="submit" className="submit-button">
                                    Subir
                                </button>
                                <button
                                    type="button"
                                    className="close-button"
                                    onClick={closeModal}
                                >
                                    Volver
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}