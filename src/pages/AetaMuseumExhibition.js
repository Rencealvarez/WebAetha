import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box as MuiBox,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  History,
  LocationOn,
  Celebration,
  Sports,
  FamilyRestroom,
  Nature,
  Psychology,
  PlayArrow,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import BundlesOfRightsNavbar from "../components/BundlesOfRightsNavbar";
import { supabase } from "../supabase";
import "./AetaMuseumExhibition.css";
import playerPlaceholder from "../assets/images/player.png";
// 3D dependencies removed for image-only mode

// 3D components removed in image-only mode

// Interactive 3D Display Component
const Interactive3DDisplay = ({
  title,
  description,
  model: Model,
  englishText,
  aetaText,
  realImage,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [language, setLanguage] = useState("english");

  return (
    <Card className="exhibit-card" elevation={8}>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center" color="primary">
          {title}
        </Typography>

        {/* Real Image View */}
        <MuiBox
          className="real-image-container"
          sx={{
            height: { xs: 180, sm: 220, md: 260 },
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {realImage ? (
            <img
              src={realImage}
              alt={`Real ${title}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <MuiBox
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                textAlign: "center",
                p: 2,
              }}
            >
              <History sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">Image not available</Typography>
            </MuiBox>
          )}
        </MuiBox>

        <MuiBox display="flex" justifyContent="center" gap={1} mb={2}>
          <Button
            variant={showDescription ? "contained" : "outlined"}
            onClick={() => setShowDescription(!showDescription)}
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 2,
              py: 0.75,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 2,
              },
            }}
          >
            {showDescription ? "Hide Description" : "Show Description"}
          </Button>
        </MuiBox>

        {showDescription && (
          <MuiBox sx={{ mt: 2 }}>
            <Tabs
              value={language}
              onChange={(e, newValue) => setLanguage(newValue)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="English" value="english" />
              <Tab label="Tagalog" value="aeta" />
            </Tabs>
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                {language === "english" ? englishText : aetaText}
              </Typography>
            </Paper>
          </MuiBox>
        )}
      </CardContent>
    </Card>
  );
};

// Cultural Heritage Section
const CulturalHeritageSection = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [rituals, setRituals] = useState([]);

  useEffect(() => {
    const loadHeritageData = async () => {
      try {
        const [languagesRes, festivalsRes, ritualsRes] = await Promise.all([
          supabase.from("museum_languages").select("*"),
          supabase.from("museum_festivals").select("*"),
          supabase.from("museum_rituals").select("*"),
        ]);

        if (languagesRes.data) setLanguages(languagesRes.data);
        if (festivalsRes.data) setFestivals(festivalsRes.data);
        if (ritualsRes.data) setRituals(ritualsRes.data);
      } catch (error) {
        console.error("Error loading heritage data:", error);
        // No local fallback; rely on database only
        setLanguages([]);
        setFestivals([]);
        setRituals([]);
      }
    };

    loadHeritageData();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Cultural Heritage Center
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab
          label="Languages & Dialects"
          sx={{
            minWidth: "auto",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        />
        <Tab
          label="Festivals & Celebrations"
          sx={{
            minWidth: "auto",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        />
        <Tab
          label="Life Cycle Rituals"
          sx={{
            minWidth: "auto",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        />
        <Tab
          label="Traditional Knowledge"
          sx={{
            minWidth: "auto",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        />
      </Tabs>

      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {languages.map((lang, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {festivals.map((festival, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {rituals.map((ritual, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  <Nature sx={{ mr: 1, verticalAlign: "middle" }} />
                  Ecological Knowledge
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Sports />
                    </ListItemIcon>
                    <ListItemText primary="Hunting techniques and animal tracking" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Nature />
                    </ListItemIcon>
                    <ListItemText primary="Medicinal plants and healing practices" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText primary="Seasonal migration patterns" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  <FamilyRestroom sx={{ mr: 1, verticalAlign: "middle" }} />
                  Social Structure
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <FamilyRestroom />
                    </ListItemIcon>
                    <ListItemText primary="Extended family networks" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Psychology />
                    </ListItemIcon>
                    <ListItemText primary="Elder wisdom and decision-making" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Celebration />
                    </ListItemIcon>
                    <ListItemText primary="Community cooperation and sharing" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

// Living Culture Gallery
const LivingCultureGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [culturalVideos, setCulturalVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utilities to derive duration from YouTube without an API key
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const id = extractYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const formatSeconds = (secs) => {
    if (!secs || Number.isNaN(secs)) return null;
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const loadYouTubeAPI = () =>
    new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const prev = document.getElementById("yt-iframe-api");
      if (!prev) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "yt-iframe-api";
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      // If already loading, poll briefly
      const check = () => {
        if (window.YT && window.YT.Player) resolve(window.YT);
        else setTimeout(check, 100);
      };
      check();
    });

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { data, error } = await supabase
          .from("museum_videos")
          .select("*");

        if (error) throw error;
        if (data && data.length > 0) {
          setCulturalVideos(data);
        } else {
          setCulturalVideos([]);
        }
      } catch (error) {
        console.error("❌ Error loading videos:", error);
        setCulturalVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Living Culture Gallery
      </Typography>

      <Grid container spacing={3}>
        {culturalVideos.length === 0 && (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No videos found. Add records to the `museum_videos` table to
                display items here.
              </Typography>
            </Paper>
          </Grid>
        )}
        {culturalVideos.map((video) => (
          <Grid item xs={12} md={4} key={video.id}>
            <Card
              className="video-card"
              elevation={4}
              onClick={() => setSelectedVideo(video)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <MuiBox sx={{ position: "relative" }}>
                <img
                  src={
                    video.thumbnail ||
                    getYouTubeThumbnail(video.videoUrl) ||
                    playerPlaceholder
                  }
                  alt={video.title}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                  onError={(e) => {
                    if (e.currentTarget.src !== playerPlaceholder) {
                      e.currentTarget.src = playerPlaceholder;
                    }
                  }}
                />
                <MuiBox
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "rgba(0,0,0,0.7)",
                    color: "white",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlayArrow sx={{ fontSize: 30 }} />
                </MuiBox>
              </MuiBox>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedVideo?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedVideo?.description}
          </Typography>
          {selectedVideo?.videoUrl ? (
            <MuiBox
              sx={{
                width: "100%",
                height: 400,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <iframe
                src={(() => {
                  // Convert YouTube watch URL to embed URL with proper time handling
                  const url = selectedVideo.videoUrl;
                  console.log("🎬 Processing video URL:", url);

                  if (url.includes("youtube.com/watch")) {
                    const videoId = url.match(/v=([^&]+)/)?.[1];
                    const timeParam = url.match(/t=(\d+)s/)?.[1];
                    console.log("🎬 Video ID:", videoId, "Time:", timeParam);

                    if (videoId) {
                      let embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      if (timeParam) {
                        embedUrl += `?start=${timeParam}`;
                      }
                      console.log("🎬 Final embed URL:", embedUrl);
                      return embedUrl;
                    }
                  }
                  // Fallback for other video URLs
                  const fallbackUrl = url.replace("watch?v=", "embed/");
                  console.log("🎬 Using fallback URL:", fallbackUrl);
                  return fallbackUrl;
                })()}
                title={selectedVideo.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: "none" }}
              />
            </MuiBox>
          ) : (
            <MuiBox
              sx={{
                bgcolor: "grey.100",
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Video URL not available
              </Typography>
            </MuiBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVideo(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

// Main Exhibition Component
const AetaMuseumExhibition = () => {
  const [activeSection, setActiveSection] = useState("artifacts");
  const [artifacts, setArtifacts] = useState([]);
  const [artifactsLoading, setArtifactsLoading] = useState(true);

  const sections = [
    { id: "artifacts", label: "Traditional Artifacts", icon: <Sports /> },
    { id: "culture", label: "Living Culture", icon: <Celebration /> },
    { id: "heritage", label: "Cultural Heritage", icon: <History /> },
  ];

  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        const { data, error } = await supabase
          .from("museum_artifacts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          // Normalize DB field names (snake_case) to the props expected by the UI (camelCase)
          const normalized = data.map((item) => {
            let resolvedImageUrl =
              item.imageUrl || item.image_url || item.image || null;
            // If it's a Supabase Storage path (no protocol), build a public URL
            if (resolvedImageUrl && !/^https?:\/\//i.test(resolvedImageUrl)) {
              try {
                const bucket =
                  item.bucket ||
                  item.bucket_name ||
                  item.storage_bucket ||
                  "museum-images";
                const rawPath = resolvedImageUrl.replace(/^\/+/, "");
                const path = encodeURI(rawPath);
                const { data: pub } = supabase.storage
                  .from(bucket)
                  .getPublicUrl(path);
                if (pub && pub.publicUrl) {
                  resolvedImageUrl = pub.publicUrl;
                }
              } catch {}
            }

            return {
              ...item,
              imageUrl: resolvedImageUrl,
              englishText:
                item.englishText || item.english_text || item.en_text || "",
              aetaText:
                item.aetaText || item.aeta_text || item.local_text || "",
            };
          });
          setArtifacts(normalized);
        }
      } catch (error) {
        console.error("Error loading artifacts:", error);
        // Do not fallback to local data anymore; rely on database
        setArtifacts([]);
      } finally {
        setArtifactsLoading(false);
      }
    };

    loadArtifacts();
  }, []);

  return (
    <div className="museum-page">
      <BundlesOfRightsNavbar />
      {/* Hero Section with Background Image */}
      <section className="hero-section museum-hero">
        <div className="hero-overlay">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-4">The Aeta People of the Philippines</h1>
              <p className="lead lead-white">Immersive Museum Exhibition</p>
              <p className="hero-description">
                Journey through the rich cultural heritage of the Aeta people,
                one of the Philippines' oldest indigenous communities. Explore
                traditional artifacts, linguistic diversity including Mag-antsi
                and Mag-indi dialects, ancient rituals, and living traditions
                that showcase their deep connection to nature and ancestral
                wisdom.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Navigation Tabs */}
        <MuiBox sx={{ borderBottom: 1, borderColor: "divider", mb: 4, mt: 4 }}>
          <Tabs
            value={activeSection}
            onChange={(e, newValue) => setActiveSection(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            // remove centered to avoid conflict with scrollable variant
          >
            {sections.map((section) => (
              <Tab
                key={section.id}
                value={section.id}
                label={section.label}
                icon={section.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </MuiBox>

        {/* Traditional Artifacts Section */}
        {activeSection === "artifacts" && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <Typography variant="h4" gutterBottom color="primary">
                Traditional Artifacts
              </Typography>
            </div>

            {artifactsLoading ? (
              <MuiBox sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </MuiBox>
            ) : (
              <Grid container spacing={4}>
                {artifacts.length === 0 && (
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body1" color="text.secondary">
                        No artifacts found. Add records to the
                        `museum_artifacts` table to display items here.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                {artifacts.map((artifact) => (
                  <Grid item xs={12} md={6} key={artifact.id}>
                    <Interactive3DDisplay
                      title={artifact.title}
                      description={artifact.description}
                      englishText={artifact.englishText}
                      aetaText={artifact.aetaText}
                      realImage={artifact.imageUrl}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        )}

        {/* Living Culture Gallery Section */}
        {activeSection === "culture" && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LivingCultureGallery />
          </motion.div>
        )}

        {/* Cultural Heritage Center Section */}
        {activeSection === "heritage" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CulturalHeritageSection />
          </motion.div>
        )}

        {/* Footer Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Paper
            elevation={2}
            sx={{ p: 3, mt: 4, bgcolor: "primary.light", color: "white" }}
          >
            <Typography variant="h6" gutterBottom>
              Cultural Sensitivity & Community Consultation
            </Typography>
            <Typography variant="body2" paragraph>
              This exhibition was made possible with the guidance of Aeta
              community members, cultural knowledge keepers, and advocates for
              indigenous rights. Every effort was taken to share their heritage
              with care and accuracy.
            </Typography>
            <Typography variant="body2">
              We honor the Aeta people as the rightful guardians of their
              culture and traditions.
            </Typography>
            <Typography variant="body3">
              If you’d like to learn more about Aeta culture or support
              indigenous communities, we encourage you to reach out to local
              cultural groups or visit our community page.
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      {/* Contact Section Footer - Matching Landing Page Style */}
      <section id="contact" className="contact-section">
        <div className="container text-center">
          <h2>Get in touch!</h2>
          <p className="text-white">Dasmariñas city, Cavite</p>
          <p className="text-white">09765607124</p>
          <p className="text-white">contact@tapdev.org</p>
        </div>
      </section>
    </div>
  );
};

export default AetaMuseumExhibition;
