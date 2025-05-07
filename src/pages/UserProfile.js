// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";

export default function Profile() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // fetch profile
      const { data, error } = await supabase
        .from("users")
        .select("name,last_name,email,profession,bio,avatar_url")
        .eq("id", user.id)
        .single();
      if (error) return console.error(error);
      setName(data.name);
      setLastName(data.last_name);
      setEmail(data.email);
      setProfession(data.profession || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("users")
      .update({
        name,
        last_name: lastName,
        profession,
        bio,
      })
      .eq("id", user.id);
    if (error) alert(error.message);
    else alert("Profile updated!");
  };

  const handleUploadAvatar = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `avatars/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file);
    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
    setAvatarUrl(publicUrl);
    setUploading(false);
  };

  const handleDeleteAvatar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("users").update({ avatar_url: null }).eq("id", user.id);
    setAvatarUrl("");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h3 className="text-center">Your Profile</h3>

        {/* Avatar */}
        <div className="text-center mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="rounded-circle mb-2"
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary rounded-circle mb-2"
              style={{ width: 100, height: 100 }}
            />
          )}
          <div>
            <label className="btn btn-sm btn-outline-primary me-2">
              {uploading ? "Uploading…" : "Change picture"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUploadAvatar}
              />
            </label>
            {avatarUrl && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDeleteAvatar}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="form-group mb-3">
            <label>First Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Last Name</label>
            <input
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email (read‑only)</label>
            <input
              type="email"
              className="form-control"
              value={email}
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Profession</label>
            <input
              className="form-control"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Bio</label>
            <textarea
              className="form-control"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
