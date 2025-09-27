import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import "../../styles/admin.css";

const MuseumContentManagement = () => {
  const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [artifacts, setArtifacts] = useState([]);
  const [newArtifact, setNewArtifact] = useState({
    title: "",
    description: "",
    englishText: "",
    aetaText: "",
    imageUrl: "",
    category: "hunting",
  });
  const [editingArtifact, setEditingArtifact] = useState(null);
  const [selectedArtifactFile, setSelectedArtifactFile] = useState(null);

  const [languages, setLanguages] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [rituals, setRituals] = useState([]);
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    region: "",
    speakers: "",
  });
  const [newFestival, setNewFestival] = useState({
    name: "",
    description: "",
    month: "",
  });
  const [newRitual, setNewRitual] = useState({
    name: "",
    description: "",
    age: "",
  });

  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editingFestival, setEditingFestival] = useState(null);
  const [editingRitual, setEditingRitual] = useState(null);

  const [culturalVideos, setCulturalVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });
  const [selectedVideoUpload, setSelectedVideoUpload] = useState(null);
  const [videoUrlColumn, setVideoUrlColumn] = useState("videoUrl");

  const [editingVideo, setEditingVideo] = useState(null);

  const [threeDModels, setThreeDModels] = useState([]);
  const [newThreeDModel, setNewThreeDModel] = useState({
    name: "",
    description: "",
    category: "hunting",
    modelFile: null,
    thumbnail: "",
  });
  const [editingThreeDModel, setEditingThreeDModel] = useState(null);
  const [selectedModelFile, setSelectedModelFile] = useState(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);

  useEffect(() => {
    loadMuseumData();
  }, []);

  const loadMuseumData = async () => {
    setLoading(true);
    try {
      const { data: artifactsData, error: artifactsError } = await supabase
        .from("museum_artifacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (artifactsError) throw artifactsError;
      setArtifacts(
        (artifactsData || []).map((row) => ({
          ...row,
          englishText:
            row.englishText !== undefined ? row.englishText : row.english_text,
          aetaText: row.aetaText !== undefined ? row.aetaText : row.aeta_text,
          imageUrl: row.imageUrl !== undefined ? row.imageUrl : row.image_url,
        }))
      );

      const { data: languagesData, error: languagesError } = await supabase
        .from("museum_languages")
        .select("*");

      const { data: festivalsData, error: festivalsError } = await supabase
        .from("museum_festivals")
        .select("*");

      const { data: ritualsData, error: ritualsError } = await supabase
        .from("museum_rituals")
        .select("*");

      if (languagesError) throw languagesError;
      if (festivalsError) throw festivalsError;
      if (ritualsError) throw ritualsError;

      setLanguages(languagesData || []);
      setFestivals(festivalsData || []);
      setRituals(ritualsData || []);

      const { data: videosData, error: videosError } = await supabase
        .from("museum_videos")
        .select("*");

      if (videosError) throw videosError;
      setCulturalVideos(videosData || []);
      if (videosData && videosData.length > 0) {
        const sample = videosData[0];
        if (Object.prototype.hasOwnProperty.call(sample, "video_url")) {
          setVideoUrlColumn("video_url");
        } else if (Object.prototype.hasOwnProperty.call(sample, "videoUrl")) {
          setVideoUrlColumn("videoUrl");
        }
      }
    } catch (error) {
      console.error("Error loading museum data:", error);
      setSnackbar({
        open: true,
        message: "Error loading museum data. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArtifactFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedArtifactFile({ file, preview: previewUrl });
    }
  };

  const handleAddArtifact = async () => {
    if (!newArtifact.title.trim() || !newArtifact.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = newArtifact.imageUrl;

      if (selectedArtifactFile) {
        const file = selectedArtifactFile.file;
        const filePath = `artifacts/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("museum-images")
          .upload(filePath, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("museum-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("museum_artifacts")
        .insert([
          {
            title: newArtifact.title,
            description: newArtifact.description,
            english_text: newArtifact.englishText,
            aeta_text: newArtifact.aetaText,
            category: newArtifact.category,
            image_url: imageUrl || null,
            model_url: null,
          },
        ])
        .select();

      if (error) throw error;

      setArtifacts([data[0], ...artifacts]);
      setNewArtifact({
        title: "",
        description: "",
        englishText: "",
        aetaText: "",
        imageUrl: "",
        category: "hunting",
      });
      setSelectedArtifactFile(null);
      setSnackbar({
        open: true,
        message: "Successfully added new artifact!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding artifact:", error);
      setSnackbar({
        open: true,
        message: "Error adding artifact. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditArtifact = (artifact) => {
    setSelectedArtifactFile(null);
    setEditingArtifact(artifact);
  };

  const handleUpdateArtifact = async () => {
    if (!editingArtifact) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_artifacts")
        .update({
          title: editingArtifact.title,
          description: editingArtifact.description,
          english_text: editingArtifact.englishText,
          aeta_text: editingArtifact.aetaText,
          category: editingArtifact.category,
          image_url:
            editingArtifact.imageUrl === "" ? null : editingArtifact.imageUrl,
          model_url: null,
        })
        .eq("id", editingArtifact.id);

      if (error) throw error;

      setArtifacts(
        artifacts.map((a) =>
          a.id === editingArtifact.id
            ? {
                ...editingArtifact,
              }
            : a
        )
      );
      setEditingArtifact(null);
      setSelectedArtifactFile(null);

      setSnackbar({
        open: true,
        message: "Successfully updated artifact!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating artifact:", error);
      setSnackbar({
        open: true,
        message: "Error updating artifact. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtifact = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_artifacts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setArtifacts(artifacts.filter((a) => a.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted artifact!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting artifact:", error);
      setSnackbar({
        open: true,
        message: "Error deleting artifact. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.name.trim() || !newLanguage.region.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("museum_languages")
        .insert([newLanguage])
        .select();

      if (error) throw error;

      setLanguages([...languages, data[0]]);
      setNewLanguage({ name: "", region: "", speakers: "" });
      setSnackbar({
        open: true,
        message: "Successfully added new language!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding language:", error);
      setSnackbar({
        open: true,
        message: "Error adding language. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFestival = async () => {
    if (!newFestival.name.trim() || !newFestival.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("museum_festivals")
        .insert([newFestival])
        .select();

      if (error) throw error;

      setFestivals([...festivals, data[0]]);
      setNewFestival({ name: "", description: "", month: "" });
      setSnackbar({
        open: true,
        message: "Successfully added new festival!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding festival:", error);
      setSnackbar({
        open: true,
        message: "Error adding festival. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRitual = async () => {
    if (!newRitual.name.trim() || !newRitual.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("museum_rituals")
        .insert([newRitual])
        .select();

      if (error) throw error;

      setRituals([...rituals, data[0]]);
      setNewRitual({ name: "", description: "", age: "" });
      setSnackbar({
        open: true,
        message: "Successfully added new ritual!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding ritual:", error);
      setSnackbar({
        open: true,
        message: "Error adding ritual. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLanguage = (language) => {
    setEditingLanguage(language);
  };

  const handleUpdateLanguage = async () => {
    if (!editingLanguage) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_languages")
        .update({
          name: editingLanguage.name,
          region: editingLanguage.region,
          speakers: editingLanguage.speakers,
        })
        .eq("id", editingLanguage.id);

      if (error) throw error;

      setLanguages(
        languages.map((l) =>
          l.id === editingLanguage.id ? editingLanguage : l
        )
      );
      setEditingLanguage(null);
      setSnackbar({
        open: true,
        message: "Successfully updated language!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating language:", error);
      setSnackbar({
        open: true,
        message: "Error updating language. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLanguage = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_languages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLanguages(languages.filter((l) => l.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted language!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting language:", error);
      setSnackbar({
        open: true,
        message: "Error deleting language. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFestival = (festival) => {
    setEditingFestival(festival);
  };

  const handleUpdateFestival = async () => {
    if (!editingFestival) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_festivals")
        .update({
          name: editingFestival.name,
          description: editingFestival.description,
          month: editingFestival.month,
        })
        .eq("id", editingFestival.id);

      if (error) throw error;

      setFestivals(
        festivals.map((f) =>
          f.id === editingFestival.id ? editingFestival : f
        )
      );
      setEditingFestival(null);
      setSnackbar({
        open: true,
        message: "Successfully updated festival!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating festival:", error);
      setSnackbar({
        open: true,
        message: "Error updating festival. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFestival = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_festivals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFestivals(festivals.filter((f) => f.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted festival!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting festival:", error);
      setSnackbar({
        open: true,
        message: "Error deleting festival. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRitual = (ritual) => {
    setEditingRitual(ritual);
  };

  const handleUpdateRitual = async () => {
    if (!editingRitual) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_rituals")
        .update({
          name: editingRitual.name,
          description: editingRitual.description,
          age: editingRitual.age,
        })
        .eq("id", editingRitual.id);

      if (error) throw error;

      setRituals(
        rituals.map((r) => (r.id === editingRitual.id ? editingRitual : r))
      );
      setEditingRitual(null);
      setSnackbar({
        open: true,
        message: "Successfully updated ritual!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating ritual:", error);
      setSnackbar({
        open: true,
        message: "Error updating ritual. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRitual = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_rituals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRituals(rituals.filter((r) => r.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted ritual!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting ritual:", error);
      setSnackbar({
        open: true,
        message: "Error deleting ritual. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedVideoUpload(file);
  };
  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      let finalVideoUrl = newVideo.videoUrl;
      if (selectedVideoUpload) {
        if (selectedVideoUpload.size > MAX_VIDEO_SIZE_BYTES) {
          throw new Error(
            `Selected video is too large (${(
              selectedVideoUpload.size /
              (1024 * 1024)
            ).toFixed(1)} MB). Max allowed is ${(
              MAX_VIDEO_SIZE_BYTES /
              (1024 * 1024)
            ).toFixed(0)} MB.`
          );
        }
        const filePath = `videos/${Date.now()}_${selectedVideoUpload.name}`;
        const { error: uploadErr } = await supabase.storage
          .from("museum-images")
          .upload(filePath, selectedVideoUpload, { upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: publicUrlData } = supabase.storage
          .from("museum-images")
          .getPublicUrl(filePath);
        finalVideoUrl = publicUrlData.publicUrl;
      }
      const insertPayload = {
        title: newVideo.title,
        description: newVideo.description,
      };
      insertPayload[videoUrlColumn] = finalVideoUrl;

      const { data, error } = await supabase
        .from("museum_videos")
        .insert([insertPayload])
        .select();

      if (error) throw error;

      setCulturalVideos([data[0], ...culturalVideos]);
      setNewVideo({
        title: "",
        description: "",
        videoUrl: "",
      });
      setSelectedVideoUpload(null);
      setSnackbar({
        open: true,
        message: "Successfully added new video!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding video:", error);
      setSnackbar({
        open: true,
        message: `Error adding video: ${error?.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_videos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCulturalVideos(culturalVideos.filter((v) => v.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted video!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      setSnackbar({
        open: true,
        message: "Error deleting video. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    setLoading(true);
    try {
      const updatePayload = {
        title: editingVideo.title,
        description: editingVideo.description,
      };
      updatePayload[videoUrlColumn] = editingVideo.videoUrl;

      const { error } = await supabase
        .from("museum_videos")
        .update(updatePayload)
        .eq("id", editingVideo.id);

      if (error) throw error;

      setCulturalVideos(
        culturalVideos.map((v) => (v.id === editingVideo.id ? editingVideo : v))
      );
      setEditingVideo(null);
      setSnackbar({
        open: true,
        message: "Successfully updated video!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating video:", error);
      setSnackbar({
        open: true,
        message: `Error updating video: ${error?.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedModelFile(file);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedThumbnailFile({ file, preview: previewUrl });
    }
  };

  const handleAddThreeDModel = async () => {
    if (!newThreeDModel.name.trim() || !newThreeDModel.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    if (!selectedModelFile) {
      setSnackbar({
        open: true,
        message: "Please select a 3D model file.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      let thumbnailUrl = newThreeDModel.thumbnail;

      if (selectedThumbnailFile) {
        const file = selectedThumbnailFile.file;
        const filePath = `3d-models/thumbnails/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("museum-images")
          .upload(filePath, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("museum-images")
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrlData.publicUrl;
      }

      const modelFilePath = `3d-models/${Date.now()}_${selectedModelFile.name}`;
      const { error: modelUploadError } = await supabase.storage
        .from("museum-images")
        .upload(modelFilePath, selectedModelFile, { upsert: false });

      if (modelUploadError) throw modelUploadError;

      const { data: modelUrlData } = supabase.storage
        .from("museum-images")
        .getPublicUrl(modelFilePath);

      const { data, error } = await supabase
        .from("museum_3d_models")
        .insert([
          {
            name: newThreeDModel.name,
            description: newThreeDModel.description,
            category: newThreeDModel.category,
            model_url: modelUrlData.publicUrl,
            thumbnail: thumbnailUrl,
          },
        ])
        .select();

      if (error) throw error;

      setThreeDModels([data[0], ...threeDModels]);
      setNewThreeDModel({
        name: "",
        description: "",
        category: "hunting",
        modelFile: null,
        thumbnail: "",
      });
      setSelectedModelFile(null);
      setSelectedThumbnailFile(null);
      setSnackbar({
        open: true,
        message: "Successfully added new 3D model!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding 3D model:", error);
      setSnackbar({
        open: true,
        message: "Error adding 3D model. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditThreeDModel = (model) => {
    setEditingThreeDModel(model);
  };

  const handleUpdateThreeDModel = async () => {
    if (!editingThreeDModel) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_3d_models")
        .update({
          name: editingThreeDModel.name,
          description: editingThreeDModel.description,
          category: editingThreeDModel.category,
        })
        .eq("id", editingThreeDModel.id);

      if (error) throw error;

      setThreeDModels(
        threeDModels.map((m) =>
          m.id === editingThreeDModel.id ? editingThreeDModel : m
        )
      );
      setEditingThreeDModel(null);
      setSnackbar({
        open: true,
        message: "Successfully updated 3D model!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating 3D model:", error);
      setSnackbar({
        open: true,
        message: "Error updating 3D model. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThreeDModel = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("museum_3d_models")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setThreeDModels(threeDModels.filter((m) => m.id !== id));
      setSnackbar({
        open: true,
        message: "Successfully deleted 3D model!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting 3D model:", error);
      setSnackbar({
        open: true,
        message: "Error deleting 3D model. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const artifactCategories = [
    { value: "hunting", label: "Hunting Tools" },
    { value: "clothing", label: "Traditional Clothing" },
    { value: "jewelry", label: "Jewelry & Adornments" },
    { value: "ceremonial", label: "Ceremonial Items" },
    { value: "domestic", label: "Domestic Tools" },
    { value: "musical", label: "Musical Instruments" },
    { value: "fishing", label: "Fishing Equipment" },
    { value: "weaving", label: "Weaving & Textiles" },
  ];

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 2, height: "100vh", overflow: "hidden" }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        Museum Content Management
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Traditional Artifacts" />
          <Tab label="Cultural Heritage" />
          <Tab label="Living Culture" />
        </Tabs>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ height: "calc(100vh - 200px)", overflow: "auto" }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Traditional Artifacts
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Add New Artifact
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={newArtifact.title}
                    onChange={(e) =>
                      setNewArtifact({ ...newArtifact, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newArtifact.category}
                      onChange={(e) =>
                        setNewArtifact({
                          ...newArtifact,
                          category: e.target.value,
                        })
                      }
                      label="Category"
                    >
                      {artifactCategories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newArtifact.description}
                    onChange={(e) =>
                      setNewArtifact({
                        ...newArtifact,
                        description: e.target.value,
                      })
                    }
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="English Text"
                    value={newArtifact.englishText}
                    onChange={(e) =>
                      setNewArtifact({
                        ...newArtifact,
                        englishText: e.target.value,
                      })
                    }
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tagalog Text"
                    value={newArtifact.aetaText}
                    onChange={(e) =>
                      setNewArtifact({
                        ...newArtifact,
                        aetaText: e.target.value,
                      })
                    }
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArtifactFileChange}
                    style={{ display: "none" }}
                    id="artifact-image-upload"
                  />
                  <label htmlFor="artifact-image-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Upload Image
                    </Button>
                  </label>
                  {selectedArtifactFile && (
                    <Box sx={{ mt: 1 }}>
                      <Card
                        sx={{
                          maxWidth: 220,
                          borderRadius: 2,
                          boxShadow: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={selectedArtifactFile.preview}
                          alt="Selected preview"
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ py: 1.5 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", textAlign: "center" }}
                          >
                            Selected Image Preview
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddArtifact}
                    disabled={loading}
                  >
                    Add Artifact
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              {artifacts.map((artifact) => (
                <Grid item xs={12} md={6} lg={4} key={artifact.id}>
                  <Card>
                    {artifact.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={artifact.imageUrl}
                        alt={artifact.title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {artifact.title}
                      </Typography>
                      <Chip
                        label={
                          artifactCategories.find(
                            (c) => c.value === artifact.category
                          )?.label || artifact.category
                        }
                        color="primary"
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {artifact.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit Artifact">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditArtifact(artifact)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Artifact">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteArtifact(artifact.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Cultural Heritage
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Languages & Dialects
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Language Name"
                    value={newLanguage.name}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Region"
                    value={newLanguage.region}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, region: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Number of Speakers"
                    value={newLanguage.speakers}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        speakers: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddLanguage}
                disabled={loading}
              >
                Add Language
              </Button>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {languages.map((lang) => (
                  <Grid item xs={12} md={4} key={lang.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {lang.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Region: {lang.region}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Speakers: {lang.speakers}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Tooltip title="Edit Language">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditLanguage(lang)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Language">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteLanguage(lang.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Festivals & Celebrations
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Festival Name"
                    value={newFestival.name}
                    onChange={(e) =>
                      setNewFestival({ ...newFestival, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newFestival.description}
                    onChange={(e) =>
                      setNewFestival({
                        ...newFestival,
                        description: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Month"
                    value={newFestival.month}
                    onChange={(e) =>
                      setNewFestival({ ...newFestival, month: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddFestival}
                disabled={loading}
              >
                Add Festival
              </Button>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {festivals.map((festival) => (
                  <Grid item xs={12} md={4} key={festival.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {festival.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {festival.description}
                        </Typography>
                        <Chip
                          label={festival.month}
                          color="secondary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Tooltip title="Edit Festival">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditFestival(festival)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Festival">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteFestival(festival.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Life Cycle Rituals
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Ritual Name"
                    value={newRitual.name}
                    onChange={(e) =>
                      setNewRitual({ ...newRitual, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newRitual.description}
                    onChange={(e) =>
                      setNewRitual({
                        ...newRitual,
                        description: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Age Range"
                    value={newRitual.age}
                    onChange={(e) =>
                      setNewRitual({ ...newRitual, age: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRitual}
                disabled={loading}
              >
                Add Ritual
              </Button>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {rituals.map((ritual) => (
                  <Grid item xs={12} md={4} key={ritual.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {ritual.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ritual.description}
                        </Typography>
                        <Chip
                          label={`Age: ${ritual.age}`}
                          color="secondary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Tooltip title="Edit Ritual">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditRitual(ritual)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Ritual">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteRitual(ritual.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Living Culture Gallery
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Add New Cultural Video
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newVideo.description}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, description: e.target.value })
                    }
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Video URL"
                    value={newVideo.videoUrl}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, videoUrl: e.target.value })
                    }
                    placeholder="YouTube or other video platform URL"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUploadChange}
                    style={{ display: "none" }}
                    id="video-file-upload"
                  />
                  <label htmlFor="video-file-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Upload Video File
                    </Button>
                  </label>
                  {selectedVideoUpload && (
                    <Box sx={{ mt: 1 }}>
                      <Chip label={selectedVideoUpload.name} size="small" />
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Max upload size: 50 MB. Larger files will be rejected.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddVideo}
                    disabled={loading}
                  >
                    Add Video
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              {culturalVideos.map((video) => (
                <Grid item xs={12} md={4} key={video.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {video.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {video.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit Video">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditVideo(video)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Video">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <Dialog
        open={!!editingArtifact}
        onClose={() => setEditingArtifact(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Artifact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={editingArtifact?.title || ""}
                onChange={(e) =>
                  setEditingArtifact({
                    ...editingArtifact,
                    title: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingArtifact?.category || "hunting"}
                  onChange={(e) =>
                    setEditingArtifact({
                      ...editingArtifact,
                      category: e.target.value,
                    })
                  }
                  label="Category"
                >
                  {artifactCategories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingArtifact?.description || ""}
                onChange={(e) =>
                  setEditingArtifact({
                    ...editingArtifact,
                    description: e.target.value,
                  })
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="English Text"
                value={editingArtifact?.englishText || ""}
                onChange={(e) =>
                  setEditingArtifact({
                    ...editingArtifact,
                    englishText: e.target.value,
                  })
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tagalog Text"
                value={editingArtifact?.aetaText || ""}
                onChange={(e) =>
                  setEditingArtifact({
                    ...editingArtifact,
                    aetaText: e.target.value,
                  })
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                value={editingArtifact?.imageUrl || ""}
                onChange={(e) =>
                  setEditingArtifact({
                    ...editingArtifact,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="Or upload an image below"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                type="file"
                accept="image/*"
                onChange={handleArtifactFileChange}
                style={{ display: "none" }}
                id="artifact-image-upload-edit"
              />
              <label htmlFor="artifact-image-upload-edit">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  {editingArtifact?.imageUrl ? "Replace Image" : "Upload Image"}
                </Button>
              </label>
              {(selectedArtifactFile || editingArtifact?.imageUrl) && (
                <Box sx={{ mt: 1 }}>
                  <Card
                    sx={{
                      maxWidth: 220,
                      borderRadius: 2,
                      boxShadow: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        selectedArtifactFile?.preview ||
                        editingArtifact?.imageUrl
                      }
                      alt="Image preview"
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "center" }}
                      >
                        {selectedArtifactFile
                          ? "New Image Preview"
                          : "Current Image"}
                      </Typography>
                      {editingArtifact?.imageUrl && !selectedArtifactFile && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm("Remove the current image?")) {
                                setEditingArtifact({
                                  ...editingArtifact,
                                  imageUrl: "",
                                });
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditingArtifact(null)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateArtifact}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingLanguage}
        onClose={() => setEditingLanguage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Language</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Language Name"
                value={editingLanguage?.name || ""}
                onChange={(e) =>
                  setEditingLanguage({
                    ...editingLanguage,
                    name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Region"
                value={editingLanguage?.region || ""}
                onChange={(e) =>
                  setEditingLanguage({
                    ...editingLanguage,
                    region: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Number of Speakers"
                value={editingLanguage?.speakers || ""}
                onChange={(e) =>
                  setEditingLanguage({
                    ...editingLanguage,
                    speakers: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditingLanguage(null)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateLanguage}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingFestival}
        onClose={() => setEditingFestival(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Festival</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Festival Name"
                value={editingFestival?.name || ""}
                onChange={(e) =>
                  setEditingFestival({
                    ...editingFestival,
                    name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={editingFestival?.description || ""}
                onChange={(e) =>
                  setEditingFestival({
                    ...editingFestival,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Month"
                value={editingFestival?.month || ""}
                onChange={(e) =>
                  setEditingFestival({
                    ...editingFestival,
                    month: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditingFestival(null)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateFestival}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingRitual}
        onClose={() => setEditingRitual(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Ritual</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ritual Name"
                value={editingRitual?.name || ""}
                onChange={(e) =>
                  setEditingRitual({
                    ...editingRitual,
                    name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={editingRitual?.description || ""}
                onChange={(e) =>
                  setEditingRitual({
                    ...editingRitual,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Age Range"
                value={editingRitual?.age || ""}
                onChange={(e) =>
                  setEditingRitual({
                    ...editingRitual,
                    age: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditingRitual(null)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRitual}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={editingVideo?.title || ""}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    title: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingVideo?.description || ""}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    description: e.target.value,
                  })
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video URL"
                value={editingVideo?.videoUrl || ""}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    videoUrl: e.target.value,
                  })
                }
                placeholder="YouTube or other video platform URL"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditingVideo(null)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateVideo}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MuseumContentManagement;
