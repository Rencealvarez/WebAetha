import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/LocalVoices.css";

const LocalVoicesWall = () => {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [voices, setVoices] = useState([]);
  const navigate = useNavigate();

  // Fetch all submissions
  const fetchVoices = async () => {
    const { data, error } = await supabase
      .from("local_voices")
      .select("*")
      .eq("approved", true)
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
        approved: false,
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
      alert("Thank you! Your post is pending admin approval.");
    }
  };

  return (
    <div className="local-voices-wall">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
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

      <div className="voices-grid">
        {voices.map((v) => (
          <div key={v.id} className="voice-card">
            <h5>{v.name}</h5>
            <p className="quote">“{v.quote}”</p>
            {v.image_url && <img src={v.image_url} alt="user upload" />}
            {v.audio_url && (
              <audio controls>
                <source src={v.audio_url} type="audio/mpeg" />
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalVoicesWall;
