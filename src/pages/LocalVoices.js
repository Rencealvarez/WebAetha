import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/LocalVoices.css";
import Loader from "../components/Loader";

const LocalVoicesWall = () => {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [voices, setVoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const fetchVoices = useCallback(async () => {
    try {
      let query = supabase
        .from("local_voices")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("quote", `%${searchTerm}%`);
      }

      if (filter === "audio") {
        query = query.not("audio_url", "is", null);
      } else if (filter === "image") {
        query = query.not("image_url", "is", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVoices(data);
    } catch (err) {
      setError("Failed to fetch voices. Please try again.");
      console.error("Fetch error:", err.message);
    }
  }, [searchTerm, filter]);

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleFilePreview = (file, type) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl({ url, type });
  };

  const isLikelySpam = (text, authorName) => {
    const content = `${authorName || ""} ${text}`.toLowerCase();
    const urlMatches = (content.match(/https?:\/\//g) || []).length;
    const hasManyLinks = urlMatches >= 2;
    const tooShort = text.trim().length < 20;
    const repeatedChars = /(.)\1{6,}/.test(content);
    const blacklist = [
      "viagra",
      "casino",
      "loan",
      "crypto",
      "porn",
      "sex",
      "xxx",
    ];
    const hasBlacklisted = blacklist.some((w) => content.includes(w));
    return hasManyLinks || tooShort || repeatedChars || hasBlacklisted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    let imageUrl = null;
    let audioUrl = null;

    try {
      const COOLDOWN_SECONDS = 60;
      const last = Number(localStorage.getItem("lv_last_submit") || 0);
      const nowTs = Date.now();
      if (nowTs - last < COOLDOWN_SECONDS * 1000) {
        const secsLeft = Math.ceil(COOLDOWN_SECONDS - (nowTs - last) / 1000);
        throw new Error(
          `Please wait ${secsLeft}s before submitting another story.`
        );
      }

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("You must be logged in to post.");

      if (image) {
        const path = `images/${Date.now()}_${image.name}`;
        const { error: imgErr } = await supabase.storage
          .from("localvoicesuploads")
          .upload(path, image);
        if (imgErr) throw new Error("Failed to upload image.");
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(path);
        imageUrl = publicUrl;
      }

      if (audio) {
        const path = `audio/${Date.now()}_${audio.name}`;
        const { error: audErr } = await supabase.storage
          .from("localvoicesuploads")
          .upload(path, audio);
        if (audErr) throw new Error("Failed to upload audio.");
        const {
          data: { publicUrl },
        } = supabase.storage.from("localvoicesuploads").getPublicUrl(path);
        audioUrl = publicUrl;
      }

      const { error: insertErr } = await supabase.from("local_voices").insert([
        {
          user_id: user.id,
          name: name.trim() || "Anonymous",
          quote: quote.trim(),
          image_url: imageUrl,
          audio_url: audioUrl,
          suspected_spam: isLikelySpam(quote, name),
          approved: false,
        },
      ]);

      if (insertErr) {
        const msg = insertErr.message || "Failed to save your story.";
        if (msg.toLowerCase().includes("rate_limit")) {
          throw new Error(
            "You are submitting too fast. Please wait a bit and try again."
          );
        }
        throw new Error(msg);
      }

      setName("");
      setQuote("");
      setImage(null);
      setAudio(null);
      setPreviewUrl(null);
      setSuccess("Thanks! Your story is pending admin approval.");

      localStorage.setItem("lv_last_submit", String(Date.now()));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "z") {
        setQuote((prev) => prev.slice(0, -1));
      }
      if (e.ctrlKey && e.key === "y") {
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="local-voices-wall" role="main">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back to previous page"
      >
        ← Back
      </button>

      <h1>🧑‍🤝‍🧑 Local Voices Wall</h1>

      <div className="controls" role="search">
        <input
          type="search"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search stories"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter stories by type"
        >
          <option value="all">All Stories</option>
          <option value="audio">With Audio</option>
          <option value="image">With Images</option>
        </select>
      </div>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="message success" role="status">
          {success}
        </div>
      )}

      <form
        className="voice-form"
        onSubmit={handleSubmit}
        aria-label="Share your story"
      >
        <div className="form-group">
          <label htmlFor="name">
            Your Name (optional)
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-describedby="name-help"
            />
          </label>
          <small id="name-help">Leave blank to post anonymously</small>
        </div>

        <div className="form-group">
          <label htmlFor="quote">
            Your Story
            <textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              aria-describedby="quote-help"
              placeholder="Share your story or quote..."
            />
          </label>
          <small id="quote-help">
            Share your thoughts, experiences, or stories
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Upload Image
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                handleFilePreview(e.target.files[0], "image");
              }}
              aria-describedby="image-help"
            />
          </label>
          <small id="image-help">Optional: Add a relevant image</small>
        </div>

        <div className="form-group">
          <label htmlFor="audio">
            Upload Audio
            <input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                setAudio(e.target.files[0]);
                handleFilePreview(e.target.files[0], "audio");
              }}
              aria-describedby="audio-help"
            />
          </label>
          <small id="audio-help">Optional: Add voice recording</small>
        </div>

        {previewUrl && (
          <div
            className="preview-section"
            role="region"
            aria-label="Media preview"
          >
            {previewUrl.type === "image" ? (
              <img src={previewUrl.url} alt="Preview" />
            ) : (
              <audio controls src={previewUrl.url}>
                <source src={previewUrl.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? (
            <Loader label="Posting" size="sm" />
          ) : (
            "Share Your Story"
          )}
        </button>
      </form>

      <div
        className="voices-grid"
        role="feed"
        aria-label="Stories from the community"
      >
        {voices.map((v) => (
          <article
            key={v.id}
            className="voice-card"
            aria-labelledby={`story-${v.id}`}
          >
            <h2 id={`story-${v.id}`}>{v.name}</h2>
            <blockquote className="quote">"{v.quote}"</blockquote>
            {v.image_url && (
              <img
                src={v.image_url}
                alt={`Image shared by ${v.name}`}
                loading="lazy"
              />
            )}
            {v.audio_url && (
              <audio controls aria-label={`Audio shared by ${v.name}`}>
                <source src={v.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </article>
        ))}
        {voices.length === 0 && (
          <p className="no-stories">No stories to display yet.</p>
        )}
      </div>
    </div>
  );
};

export default LocalVoicesWall;
