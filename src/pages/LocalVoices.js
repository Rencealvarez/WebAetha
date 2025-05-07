// src/pages/LocalVoicesWall.js
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

  // 1) Fetch only approved entries
  const fetchVoices = async () => {
    const { data, error } = await supabase
      .from("local_voices")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setVoices(data);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  // 2) Handle submission (uploads + insert as pending)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = null;
    let audioUrl = null;

    // 🔐 Get current user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error("Auth error:", userErr?.message);
      alert("You must be logged in to post.");
      return;
    }

    // upload image
    if (image) {
      const path = `images/${Date.now()}_${image.name}`;
      const { error: imgErr } = await supabase.storage
        .from("localvoicesuploads")
        .upload(path, image);
      if (imgErr) {
        console.error("Image upload:", imgErr.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    // upload audio
    if (audio) {
      const path = `audio/${Date.now()}_${audio.name}`;
      const { error: audErr } = await supabase.storage
        .from("localvoicesuploads")
        .upload(path, audio);
      if (audErr) {
        console.error("Audio upload:", audErr.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(path);
        audioUrl = publicUrl;
      }
    }

    // insert pending row
    const { error: insertErr } = await supabase.from("local_voices").insert([
      {
        user_id: user.id,
        name: name.trim() || "Anonymous",
        quote: quote.trim(),
        image_url: imageUrl,
        audio_url: audioUrl,
        approved: false,
      },
    ]);

    if (insertErr) {
      console.error("Insert error:", insertErr.message);
      alert("Failed to post. Please try again.");
    } else {
      setName("");
      setQuote("");
      setImage(null);
      setAudio(null);
      alert("Thanks! Your story is pending admin approval.");
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
          placeholder="Share a quote or story…"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />

        <label>
          Upload Image:
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
        {voices.length === 0 && <p>No approved stories yet.</p>}
      </div>
    </div>
  );
};

export default LocalVoicesWall;
