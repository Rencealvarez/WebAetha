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
  Pagination,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import "../../styles/admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [panoramicImages, setPanoramicImages] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [didYouKnowFacts, setDidYouKnowFacts] = useState([]);
  const [newFact, setNewFact] = useState("");
  const [newQuiz, setNewQuiz] = useState({
    image_id: "",
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [imagesResponse, quizzesResponse, factsResponse] =
        await Promise.all([
          supabase.from("panoramic_images").select("*"),
          supabase.from("quizzes").select("*"),
          supabase.from("did_you_know").select("*"),
        ]);

      if (imagesResponse.error) throw imagesResponse.error;
      if (quizzesResponse.error) throw quizzesResponse.error;
      if (factsResponse.error) throw factsResponse.error;

      setPanoramicImages(imagesResponse.data || []);
      setQuizzes(quizzesResponse.data || []);
      setDidYouKnowFacts(factsResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile({ file, preview: previewUrl });
    }
  };

  const handleAddImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const file = selectedFile.file;
      const filePath = file.name;

      const { error: uploadError } = await supabase.storage
        .from("panoramic-images")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("panoramic-images")
        .getPublicUrl(filePath);

      const { data, error: insertError } = await supabase
        .from("panoramic_images")
        .insert([
          {
            url: publicUrlData.publicUrl,
            file_name: file.name,
          },
        ])
        .select();

      if (insertError) throw insertError;
      if (data) {
        setPanoramicImages([...panoramicImages, ...data]);
        setSelectedFile(null);
        setSnackbar({
          open: true,
          message: "Successfully uploaded new panoramic image!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setSnackbar({
        open: true,
        message: "Error uploading image. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (type, id) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      const { type, id } = itemToDelete;
      let error;

      switch (type) {
        case "image":
          error = (
            await supabase.from("panoramic_images").delete().eq("id", id)
          ).error;
          if (!error)
            setPanoramicImages(panoramicImages.filter((img) => img.id !== id));
          break;
        case "quiz":
          error = (await supabase.from("quizzes").delete().eq("id", id)).error;
          if (!error) setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
          break;
        case "fact":
          error = (await supabase.from("did_you_know").delete().eq("id", id))
            .error;
          if (!error)
            setDidYouKnowFacts(
              didYouKnowFacts.filter((fact) => fact.id !== id)
            );
          break;
        default:
          break;
      }

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEditFact = (fact) => {
    setEditingFact(fact);
    setEditMode(true);
  };

  const handleUpdateFact = async () => {
    if (!editingFact) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("did_you_know")
        .update({ fact: editingFact.fact })
        .eq("id", editingFact.id);

      if (error) throw error;

      setDidYouKnowFacts(
        didYouKnowFacts.map((f) => (f.id === editingFact.id ? editingFact : f))
      );
    } catch (error) {
      console.error("Error updating fact:", error);
    } finally {
      setLoading(false);
      setEditMode(false);
      setEditingFact(null);
    }
  };

  const handleAddFact = async () => {
    if (!newFact.trim()) {
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("did_you_know")
        .insert([{ fact: newFact }])
        .select();

      if (error) throw error;
      if (data) {
        setDidYouKnowFacts([...didYouKnowFacts, ...data]);
        setNewFact("");
        setSnackbar({
          open: true,
          message: "Successfully added new fact!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error adding fact:", error);
      setSnackbar({
        open: true,
        message: "Error adding fact. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.image_id) {
      setSnackbar({
        open: true,
        message: "Please select an image for the quiz.",
        severity: "warning",
      });
      return;
    }
    if (!newQuiz.question.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a question for the quiz.",
        severity: "warning",
      });
      return;
    }
    if (!newQuiz.answer.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter the correct answer for the quiz.",
        severity: "warning",
      });
      return;
    }
    if (newQuiz.options.some((option) => !option.trim())) {
      setSnackbar({
        open: true,
        message: "Please fill in all quiz options.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .insert([newQuiz])
        .select();

      if (error) throw error;
      if (data) {
        setQuizzes([...quizzes, ...data]);
        setNewQuiz({
          image_id: "",
          question: "",
          options: ["", "", "", ""],
          answer: "",
        });
        setSnackbar({
          open: true,
          message: "Successfully added new quiz!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error adding quiz:", error);
      setSnackbar({
        open: true,
        message: "Error adding quiz. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFacts = didYouKnowFacts.filter((fact) =>
    fact.fact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFacts = filteredFacts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Sort quizzes by the order of panoramicImages (dropdown order)
  const imageOrder = panoramicImages.map((img) => img.file_name);
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const aImage =
      panoramicImages.find((img) => img.id === a.image_id)?.file_name || "";
    const bImage =
      panoramicImages.find((img) => img.id === b.image_id)?.file_name || "";
    return imageOrder.indexOf(aImage) - imageOrder.indexOf(bImage);
  });

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        height: "100vh",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
    >
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 0,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Panoramic Images" />
          <Tab label="Quizzes" />
          <Tab label="Did You Know" />
        </Tabs>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Manage Panoramic Images
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  border: "2px dashed #ccc",
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                  </Button>
                </label>
                {selectedFile && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={selectedFile.preview}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddImage}
                        sx={{ mr: 1 }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedFile(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>

              <Grid container columns={12} spacing={2}>
                {panoramicImages.map((image) => (
                  <Grid span={4} key={image.id}>
                    <Card sx={{ height: "100%" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={image.url}
                        alt={image.file_name}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {image.file_name}
                        </Typography>
                        <Tooltip title="Delete Image">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteConfirm("image", image.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
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
                Manage Quizzes
              </Typography>

              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid span={12}>
                    <FormControl fullWidth sx={{ minWidth: 220 }}>
                      <InputLabel id="quiz-image-label" shrink>
                        Select Image
                      </InputLabel>
                      <Select
                        fullWidth
                        labelId="quiz-image-label"
                        id="quiz-image-select"
                        value={newQuiz.image_id || ""}
                        label="Select Image"
                        onChange={(e) =>
                          setNewQuiz({ ...newQuiz, image_id: e.target.value })
                        }
                      >
                        {panoramicImages.map((image) => (
                          <MenuItem key={image.id} value={image.id}>
                            {image.file_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid span={12}>
                    <TextField
                      fullWidth
                      label="Question"
                      value={newQuiz.question}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, question: e.target.value })
                      }
                    />
                  </Grid>
                  {newQuiz.options.map((option, index) => (
                    <Grid span={6} key={index}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuiz.options];
                          newOptions[index] = e.target.value;
                          setNewQuiz({ ...newQuiz, options: newOptions });
                        }}
                      />
                    </Grid>
                  ))}
                  <Grid span={12}>
                    <TextField
                      fullWidth
                      label="Correct Answer"
                      value={newQuiz.answer}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, answer: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid span={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddQuiz}
                    >
                      Add Quiz
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container columns={12} spacing={2} justifyContent="center">
                {sortedQuizzes.map((quiz) => (
                  <Grid
                    span={12}
                    key={quiz.id}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      sx={{
                        minHeight: 260,
                        maxWidth: 600,
                        width: "100%",
                        m: 1,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 3,
                        borderRadius: 3,
                        bgcolor: "#fff",
                        transition: "box-shadow 0.2s",
                        "&:hover": {
                          boxShadow: 8,
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
                        >
                          {quiz.question}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Image:{" "}
                          {panoramicImages.find(
                            (img) => img.id === quiz.image_id
                          )?.file_name || "Unknown"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ mt: 1, mb: 1 }}>
                          {quiz.options.map((option, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ mb: 0.5 }}
                            >
                              <b>{index + 1}.</b> {option}
                            </Typography>
                          ))}
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontWeight: 500, color: "success.main" }}
                        >
                          Correct Answer: {quiz.answer}
                        </Typography>
                      </CardContent>
                      <Box sx={{ textAlign: "right", p: 1 }}>
                        <Tooltip title="Delete Quiz">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteConfirm("quiz", quiz.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Manage Did You Know Facts
              </Typography>

              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid span={8}>
                    <TextField
                      fullWidth
                      label="Search Facts"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid span={4}>
                    <TextField
                      fullWidth
                      label="New Fact"
                      value={newFact}
                      onChange={(e) => setNewFact(e.target.value)}
                    />
                  </Grid>
                  <Grid span={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddFact}
                    >
                      Add Fact
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container columns={12} spacing={2}>
                {paginatedFacts.map((fact) => (
                  <Grid span={12} key={fact.id}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        {editMode && editingFact?.id === fact.id ? (
                          <TextField
                            fullWidth
                            value={editingFact.fact}
                            onChange={(e) =>
                              setEditingFact({
                                ...editingFact,
                                fact: e.target.value,
                              })
                            }
                            multiline
                            rows={2}
                          />
                        ) : (
                          <Typography variant="body1">{fact.fact}</Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          {editMode && editingFact?.id === fact.id ? (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateFact}
                                sx={{ mr: 1 }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setEditMode(false);
                                  setEditingFact(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Edit Fact">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditFact(fact)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Fact">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDeleteConfirm("fact", fact.id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
              >
                <Pagination
                  count={Math.ceil(filteredFacts.length / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {itemToDelete?.type === "image" && (
            <>
              Are you sure you want to delete this panoramic image? This action
              cannot be undone.
            </>
          )}
          {itemToDelete?.type === "quiz" && (
            <>
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </>
          )}
          {itemToDelete?.type === "fact" && (
            <>
              Are you sure you want to delete this fact? This action cannot be
              undone.
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
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

export default Admin;
