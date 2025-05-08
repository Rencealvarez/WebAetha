// src/pages/UserProfilePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaPencilAlt, FaRegEye } from "react-icons/fa";
import "../styles/UserProfile.css";

export default function UserProfilePage() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [registeredAt, setRegisteredAt] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
    cover_url: "",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user: session },
      } = await supabase.auth.getUser();
      if (!session) return nav("/login");
      setUser(session);
      setRegisteredAt(new Date(session.created_at).toLocaleDateString());

      let { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.id)
        .single();

      if (error && error.code === "PGRST116") {
        await supabase.from("user_profiles").insert({
          id: session.id,
          email: session.email,
        });
        ({ data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.id)
          .single());
      }
      if (error) console.error("fetch profile:", error);

      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          cover_url: data.cover_url || "",
        });
      }
    })();
  }, [nav]);

  const handleSave = async () => {
    let { avatar_url, cover_url } = form;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${user.id}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, {
          upsert: true,
          metadata: { user_id: user.id },
        });
      if (error) return alert("Avatar upload failed");
      ({
        data: { publicUrl: avatar_url },
      } = supabase.storage.from("avatars").getPublicUrl(path));
    }

    if (coverFile) {
      const ext = coverFile.name.split(".").pop();
      const path = `covers/${user.id}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("covers")
        .upload(path, coverFile, {
          upsert: true,
          metadata: { user_id: user.id },
        });
      if (error) return alert("Cover upload failed");
      ({
        data: { publicUrl: cover_url },
      } = supabase.storage.from("covers").getPublicUrl(path));
    }

    const { error: profErr } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: form.full_name,
        bio: form.bio,
        avatar_url,
        cover_url,
      },
      { onConflict: "id" }
    );
    if (profErr) return alert("Profile save failed");

    const updated = {
      ...profile,
      full_name: form.full_name,
      bio: form.bio,
      avatar_url,
      cover_url,
    };
    setProfile(updated);
    setForm(updated);
    setEditing(false);
    setAvatarFile(null);
    setCoverFile(null);
  };

  if (!profile) return <div>Loading…</div>;

  return (
    <div className="profile-card">
      {/* Cover + Avatar */}
      <div className="cover-wrapper">
        <img
          src={profile.cover_url || "/default_cover.jpg"}
          alt="cover"
          className="cover-photo"
        />

        {/* Avatar */}
        <div className="avatar-wrapper">
          <img
            src={profile.avatar_url || "/default_avatar.png"}
            alt="avatar"
            className="avatar-large"
          />
          {editing && (
            <label className="avatar-edit-icon">
              <FaPencilAlt />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* Cover edit pencil */}
        {editing && (
          <label className="cover-edit-icon">
            <FaPencilAlt />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </label>
        )}
      </div>

      {/* White card with details */}
      <div className="profile-content">
        <button
          className="edit-btn"
          onClick={() => {
            setEditing(!editing);
            setForm(profile);
          }}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

        <div className="info-block">
          <h1 className="name">{profile.full_name || user.email}</h1>
          <p className="email">{profile.email}</p>
          <FaRegEye className="eye-icon" />
        </div>

        <div className="details">
          <div className="row">
            <div className="label">Full Name</div>
            <div className="value">
              {editing ? (
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              ) : (
                profile.full_name || "—"
              )}
            </div>
          </div>

          <div className="row">
            <div className="label">Email</div>
            <div className="value">{profile.email}</div>
          </div>

          <div className="row">
            <div className="label">Registered at</div>
            <div className="value">{registeredAt}</div>
          </div>
        </div>

        <div className="actions">
          <button className="btn-back" onClick={() => nav(-1)}>
            Back
          </button>
        </div>

        {editing && (
          <div className="actions action-save">
            <button className="btn-save" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
