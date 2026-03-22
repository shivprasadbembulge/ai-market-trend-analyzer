import { useState } from "react";
import API from "../services/api";

export default function Upload({ setFile }) {
  const [file, setLocalFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    try {
      if (!file) {
        alert("Select file first");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file); // 🔥 MUST MATCH BACKEND

      console.log("Uploading file:", file);

      const res = await API.post("upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      setFile(file);

      alert(`✅ Uploaded ${res.data.rows} rows`);

    } catch (err) {
  console.log("UPLOAD ERROR:", err);

  if (err.response) {
    alert(JSON.stringify(err.response.data));
  } else {
    alert("Server not reachable");
  }


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Upload Dataset</h3>

      <input
        type="file"
        onChange={(e) => {
          console.log("Selected file:", e.target.files[0]);
          setLocalFile(e.target.files[0]);
        }}
      />

      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Dataset"}
      </button>
    </div>
  );
}