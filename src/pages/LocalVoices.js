import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "../styles/LocalVoices.css";

const LocalVoicesWall = () => {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [voices, setVoices] = useState([]);

  // Fetch all submissions
  const fetchVoices = async () => {
    const { data, error } = await supabase
      .from("local_voices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      console.log("Fetched voices:", data);
      setVoices(data);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    let audioUrl = null;

    // 1) Upload image if provided
    if (image) {
      const imagePath = `images/${Date.now()}_${image.name}`;
      const { data: imgData, error: imgErr } = await supabase.storage
        .from("localvoicesuploads")
        .upload(imagePath, image);

      if (imgErr) {
        console.error("Image upload error:", imgErr.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(imagePath);
        console.log("Image publicUrl:", publicUrl);
        imageUrl = publicUrl;
      }
    }

    // 2) Upload audio if provided
    if (audio) {
      const audioPath = `audio/${Date.now()}_${audio.name}`;
      const { data: audData, error: audErr } = await supabase.storage
        .from("localvoicesuploads")
        .upload(audioPath, audio);

      if (audErr) {
        console.error("Audio upload error:", audErr.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(audioPath);
        console.log("Audio publicUrl:", publicUrl);
        audioUrl = publicUrl;
      }
    }

    // 3) Insert into local_voices table
    const { error: insertError } = await supabase.from("local_voices").insert([
      {
        name: name.trim() || "Anonymous",
        quote: quote.trim(),
        image_url: imageUrl,
        audio_url: audioUrl,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
    } else {
      // Clear form fields
      setName("");
      setQuote("");
      setImage(null);
      setAudio(null);
      fetchVoices();
    }
  };

  return (
    <div className="local-voices-wall">
      <h2>🧑‍🤝‍🧑 Local Voices Wall</h2>

      <form className="voice-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Share a quote or story..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />

        <label>
          Upload an Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <label>
          Upload Audio:
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
          />
        </label>

        <button type="submit">Post to Wall</button>
      </form>

      <div className="voices-list">
        {voices.map((v, idx) => (
          <div key={idx} className="voice-card">
            <h5>{v.name || "Anonymous"}</h5>
            <p>“{v.quote}”</p>

            {v.image_url && (
              <img
                src={v.image_url}
                alt="User submission"
                style={{
                  display: "block",
                  maxWidth: "100%",
                  margin: "10px 0",
                }}
              />
            )}

            {v.audio_url && (
              <audio
                controls
                src={v.audio_url}
                style={{ display: "block", margin: "10px 0" }}
              >
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalVoicesWall;
