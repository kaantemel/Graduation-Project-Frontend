import { color } from "@chakra-ui/react";
import React from "react";
import { ChangeEvent, useState } from "react";

function FileUploadSingle({ setRoutes, option, clearRoute }) {
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

  const handleUploadClick = async () => {
    if (!fileContent) {
      return;
    }
    const payload = {
      fileContent: fileContent,
    };
    clearRoute();
    if (option === "Tabu") {
      // 👇 Uploading the file content as JSON
      await fetch("http://localhost:5000/post", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRoutes(data["results"]);
        })
        .catch((err) => console.error(err));
    } else if (option === "Gurobi") {
      // 👇 Uploading the file content as JSON
      await fetch("http://localhost:5000/postgurobi", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRoutes(data["results"]);
        })
        .catch((err) => console.error(err));
    }
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
