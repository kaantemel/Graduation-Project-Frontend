import { color } from "@chakra-ui/react";
import React from "react";
import { ChangeEvent, useState } from "react";

function FileUploadSingle() {
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        // The file's text will be printed here
        const content = event.target?.result as string;

        // Manipulate the content here
        const manipulatedContent = content; // This is just an example. You can manipulate the content based on your needs.
        console.log(manipulatedContent);
        setFileContent(manipulatedContent);
      };

      reader.readAsText(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    // 👇 Uploading the file using the fetch API to the server
    fetch("https://httpbin.org/post", {
      method: "POST",
      body: file,
      // 👇 Set headers manually for single file upload
      headers: {
        "content-type": file.type,
        "content-length": `${file.size}`,
        "solver-type": "solver", // 👈 Headers need to be a string
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <input type="file" onChange={handleFileChange} />
        <div>{file && `${file.name} - ${file.type}`}</div>
      </div>

      <button
        style={{
          backgroundColor: "#B83280",
          color: "white",
          borderRadius: "5px",
          marginBottom: "10px",
          padding: "5px",
        }}
        onClick={handleUploadClick}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUploadSingle;
