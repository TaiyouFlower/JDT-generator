"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(false);
  const [compressedImages, setCompressedImages] = useState({});

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/generate/", {
        text: inputText,
      });
      setGeneratedCode(response.data.wordpress_code);
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedCode)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy code.");
      });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Store compressed image URLs
      setCompressedImages(response.data.compressedImages);
      setUploadedImage(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleDownload = async (imageKey) => {
    if (compressedImages[imageKey]) {
      try {
        const imageUrl = compressedImages[imageKey];
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement("a");
        a.href = url;
  
        // Extract filename from the URL dynamically
        const filename = imageUrl.split("/").pop(); 
        a.download = filename; // Use extracted filename
  
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download image.");
      }
    } else {
      alert("Image not available for download.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>WordPress Code Generator</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste the job description text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
      />
      <div className="flex gap-4 my-4">
        <button
          onClick={handleGenerate}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        <button
          onClick={copyToClipboard}
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            padding: "0.5rem 1rem",
          }}
        >
          Copy
        </button>
      </div>
      <h2>Generated WordPress Code</h2>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          whiteSpace: "pre-wrap",
          overflowX: "auto",
        }}
      >
        {generatedCode}
      </pre>
      <h2>Upload and Download Image</h2>
      <input type="file" onChange={handleImageUpload} />
      {uploadedImage && (
        <div>
          <h3>Compressed Images:</h3>
          <button
            onClick={() => handleDownload("1200x1200-jpg", "jpg")}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download 1200x1200 JPG
          </button>
          <button
            onClick={() => handleDownload("1200x1200-webp", "webp")}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download 1200x1200 WEBP
          </button>
          <button
            onClick={() => handleDownload("600x600-jpg", "jpg")}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download 600x600 JPG
          </button>
          <button
            onClick={() => handleDownload("600x600-webp", "webp")}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download 600x600 WEBP
          </button>
        </div>
      )}
    </div>
  );
}
