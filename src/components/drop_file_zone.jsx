import { Dropzone,FileMosaic } from "@files-ui/react";
import * as React from "react";

export default function Drop_File_Zone() {
  const [files, setFiles] = React.useState([]);
  const update_states = ["preparing", "uploading", "aborted", "error", "success"];
  const updateFiles = (incommingFiles) => {
    //do something with the files
    setFiles(incommingFiles);
    //even your own upload implementation
  };
  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      accept="application/pdf, application/application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      footerConfig={{ customMessage: "Formatos permitidos : PDF, Excel, XLSX" }}
      style={{ height: "250px" }}
    >
      {files.map((file) => (
          <FileMosaic key={file.id} {...file} onDelete={removeFile} uploadStatus="success" />
        ))}
    </Dropzone>
  );
}