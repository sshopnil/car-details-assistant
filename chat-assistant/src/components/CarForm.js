// src/components/CarForm.js
"use client";
import { useState } from "react";

export default function CarForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const data = JSON.parse(text);

      try {
        // Generate embeddings for each car
        for (const car of data.cars) {
          const response = await fetch("/api/embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: car.carModel + " " + car.brand }),
          });

          const { embeddings } = await response.json();

          // Store embeddings in Pinecone (or any other database)
          await fetch("/api/pinecone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: car.id, embeddings }),
          });
        }

        setMessage("Embeddings generated and stored successfully!");
      } catch (error) {
        console.error(error);
        setMessage("An error occurred.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h1>Upload Car Data</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
