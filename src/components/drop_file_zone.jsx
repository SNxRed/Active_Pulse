import { Dropzone, FileMosaic } from "@files-ui/react";
import * as React from "react";

export default function Drop_File_Zone({ onFileSelect }) {
  const [files, setFiles] = React.useState([]);

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
  };

  const handleUpload = async () => {
    for (const file of files) {
      await onFileSelect(file); // Llama a la función de subida en UserList
    }
    setFiles([]); // Limpia la lista de archivos después de la subida
  };

  return (
    <>
      <Dropzone
        onChange={updateFiles}
        value={files}
        accept="application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        footerConfig={{ customMessage: "Formatos permitidos: PDF, Excel, XLSX" }}
        style={{ height: "250px" }}
        label="Arrastra y suelta tus archivos aquí, o haz clic para seleccionarlo"
      >
        {files.map((file) => (
          <FileMosaic 
            key={file.id} 
            {...file} 
            uploadStatus="success" 
          />
        ))}
      </Dropzone>
      <button onClick={handleUpload} className="modal-file-button"><span>Enviar</span></button> 
    </>
  );
}