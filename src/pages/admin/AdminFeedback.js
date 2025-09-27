import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminFeedback.css";
import Loader from "../../components/Loader";

const getFilename = (url) => (url ? url.split("/").pop() : "");

const AdminFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submitted_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState(null);

  // Only allow valid column names for sorting
  const validSortFields = ["submitted_at", "image_path", "emoji", "status"];
  const safeSortField = validSortFields.includes(sortField)
    ? sortField
    : "submitted_at";

  const fetchFeedbackData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback_logs")
        .select("*")
        .order(safeSortField, { ascending: sortDirection === "asc" });
      if (error) throw error;
      setFeedbackData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showNotification("Error fetching feedback data", "error");
    } finally {
      setLoading(false);
    }
  }, [safeSortField, sortDirection]);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Group feedback by unique image filename and aggregate reactions
  const imageMap = {};
  feedbackData.forEach((item) => {
    const filename = getFilename(item.image_path);
    if (!imageMap[filename]) {
      imageMap[filename] = {
        filename,
        image_path: item.image_path,
        submitted_at: item.submitted_at,
        reactions: { "👍": 0, "😐": 0, "👎": 0 },
        id: item.id,
      };
    }
    if (imageMap[filename].submitted_at > item.submitted_at) {
      imageMap[filename].submitted_at = item.submitted_at;
    }
    if (imageMap[filename].image_path !== item.image_path) {
      imageMap[filename].image_path = item.image_path;
    }
    if (imageMap[filename].id > item.id) {
      imageMap[filename].id = item.id;
    }
    if (imageMap[filename].reactions[item.emoji] !== undefined) {
      imageMap[filename].reactions[item.emoji]++;
    }
  });
  const uniqueImages = Object.values(imageMap);

  // Apply search and pagination to unique images
  const filteredImages = uniqueImages.filter((item) =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  return (
    <div className="admin-feedback">
      <header className="feedback-header">
        <h1>Feedback for Panoramic Images</h1>
      </header>
      {notification && (
        <div className={`notification ${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      <div className="feedback-controls">
        <input
          type="search"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search feedback by filename"
        />
      </div>
      {loading ? (
        <Loader label="Loading feedback" fullscreen size="md" />
      ) : error ? (
        <div className="error-message" role="alert">
          {error}
        </div>
      ) : (
        <div className="feedback-table-container">
          <table className="feedback-table" role="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedItems(
                        e.target.checked ? paginatedImages.map((i) => i.id) : []
                      )
                    }
                    checked={
                      selectedItems.length === paginatedImages.length &&
                      paginatedImages.length > 0
                    }
                    aria-label="Select all"
                  />
                </th>
                <th onClick={() => handleSort("image_path")}>
                  Filename{" "}
                  {sortField === "image_path" && (
                    <span className="sort-indicator">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>Preview</th>
                <th onClick={() => handleSort("submitted_at")}>
                  Date{" "}
                  {sortField === "submitted_at" && (
                    <span className="sort-indicator">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>👍</th>
                <th>😐</th>
                <th>👎</th>
              </tr>
            </thead>
            <tbody>
              {paginatedImages.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) =>
                          setSelectedItems(
                            e.target.checked
                              ? [...selectedItems, item.id]
                              : selectedItems.filter((id) => id !== item.id)
                          )
                        }
                        aria-label={`Select ${item.filename}`}
                      />
                    </td>
                    <td>
                      <strong>{item.filename}</strong>
                    </td>
                    <td>
                      <img
                        src={item.image_path}
                        alt={item.filename}
                        className="thumb"
                      />
                    </td>
                    <td>{new Date(item.submitted_at).toLocaleString()}</td>
                    <td>{item.reactions["👍"]}</td>
                    <td>{item.reactions["😐"]}</td>
                    <td>{item.reactions["👎"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination" role="navigation" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
