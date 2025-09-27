import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaPencilAlt, FaRegEye, FaCheck, FaTimes } from "react-icons/fa";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../styles/UserProfile.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function UserProfilePage() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [registeredAt, setRegisteredAt] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropMode, setCropMode] = useState(null);
  const [crop, setCrop] = useState();
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef(null);
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

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const aspect = cropMode === "avatar" ? 1 : 16 / 9;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result);
        setCropMode("avatar");
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result);
        setCropMode("cover");
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File(
          [blob],
          cropMode === "avatar" ? "avatar.jpg" : "cover.jpg",
          { type: "image/jpeg" }
        );
        if (cropMode === "avatar") {
          setAvatarFile(file);
          setForm((prev) => ({
            ...prev,
            avatar_url: URL.createObjectURL(blob),
          }));
        } else {
          setCoverFile(file);
          setForm((prev) => ({
            ...prev,
            cover_url: URL.createObjectURL(blob),
          }));
        }
        setCropMode(null);
        setImgSrc("");
      }
    }, "image/jpeg");
  };

  const handleCancelCrop = () => {
    setCropMode(null);
    setImgSrc("");
  };

  const handleSave = async () => {
    setIsUploading(true);
    let { avatar_url, cover_url } = form;

    try {
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `avatars/${user.id}_${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, {
            upsert: true,
            metadata: { user_id: user.id },
          });
        if (error) throw new Error("Avatar upload failed");
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
        if (error) throw new Error("Cover upload failed");
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
      if (profErr) throw new Error("Profile save failed");

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
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) return <div>Loading…</div>;

  return (
    <div className="profile-card">
      {cropMode && (
        <div className="crop-modal">
          <div className="crop-container">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={cropMode === "avatar" ? 1 : 16 / 9}
              circularCrop={cropMode === "avatar"}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                onLoad={onImageLoad}
                alt="Crop preview"
              />
            </ReactCrop>
            <div className="crop-actions">
              <button className="btn-crop" onClick={handleCropComplete}>
                <FaCheck /> Apply
              </button>
              <button className="btn-cancel" onClick={handleCancelCrop}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`cover-wrapper ${coverFile ? "has-selected-image" : ""} ${
          isUploading ? "is-uploading" : ""
        }`}
      >
        <img
          src={form.cover_url || profile.cover_url || "/default_cover.jpg"}
          alt="cover"
          className="cover-photo"
        />

        <div
          className={`avatar-wrapper ${
            avatarFile ? "has-selected-image" : ""
          } ${isUploading ? "is-uploading" : ""}`}
        >
          <img
            src={form.avatar_url || profile.avatar_url || "/default_avatar.png"}
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
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>

        {editing && (
          <label className="cover-edit-icon">
            <FaPencilAlt />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverChange}
            />
          </label>
        )}
      </div>

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
