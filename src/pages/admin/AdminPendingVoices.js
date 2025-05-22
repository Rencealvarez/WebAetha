import React, { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminPendingVoices.css";

const AdminPendingVoices = () => {
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [selectedVoices, setSelectedVoices] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // Fetch voices with pagination and filters
  const fetchVoices = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from("local_voices")
          .select("*", { count: "exact" });

        // Apply status filter
        if (statusFilter === "pending") {
          query = query.eq("approved", false);
        } else if (statusFilter === "approved") {
          query = query.eq("approved", true);
        }

        // Apply search
        if (searchTerm) {
          query = query.or(
            `name.ilike.%${searchTerm}%,quote.ilike.%${searchTerm}%`
          );
        }

        // Apply sorting
        query = query.order(sortConfig.key, {
          ascending: sortConfig.direction === "asc",
        });

        // Apply pagination
        const from = (pageNum - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        setVoices((prev) => (append ? [...prev, ...data] : data));
        setHasMore(count > pageNum * ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err) {
        setError("Failed to fetch voices. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, sortConfig]
  );

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    fetchVoices(1, false);
  }, [fetchVoices]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle batch actions
  const handleBatchAction = async (action) => {
    if (selectedVoices.size === 0) return;

    setConfirmAction({
      type: action,
      count: selectedVoices.size,
    });
    setIsConfirming(true);
  };

  const executeBatchAction = async () => {
    try {
      setIsLoading(true);
      const action = confirmAction.type;
      const ids = Array.from(selectedVoices);

      if (action === "approve") {
        await supabase
          .from("local_voices")
          .update({ approved: true })
          .in("id", ids);
      } else if (action === "delete") {
        await supabase.from("local_voices").delete().in("id", ids);
      }

      setSelectedVoices(new Set());
      await fetchVoices(1, false);
    } catch (err) {
      setError(`Failed to ${confirmAction.type} voices. Please try again.`);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
      setConfirmAction(null);
    }
  };

  // Handle individual actions
  const handleAction = async (id, action) => {
    try {
      setIsLoading(true);
      if (action === "approve") {
        await supabase
          .from("local_voices")
          .update({ approved: true })
          .eq("id", id);
      } else if (action === "delete") {
        await supabase.from("local_voices").delete().eq("id", id);
      }
      await fetchVoices(page, false);
    } catch (err) {
      setError(`Failed to ${action} voice. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle infinite scroll
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (
        scrollHeight - scrollTop <= clientHeight * 1.5 &&
        !isLoading &&
        hasMore
      ) {
        fetchVoices(page + 1, true);
      }
    },
    [fetchVoices, isLoading, hasMore, page]
  );

  // Memoize sorted and filtered voices
  const sortedVoices = useMemo(() => {
    return [...voices].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [voices, sortConfig]);

  return (
    <div className="admin-pending" role="main">
      <header className="admin-header">
        <h1>Voice Submissions Management</h1>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
      </header>

      <div className="admin-controls">
        <div className="search-filter">
          <input
            type="search"
            placeholder="Search voices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search voices"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="batch-actions">
          <button
            className="btn batch-btn"
            onClick={() => handleBatchAction("approve")}
            disabled={selectedVoices.size === 0}
            aria-label={`Approve ${selectedVoices.size} selected voices`}
          >
            Approve Selected
          </button>
          <button
            className="btn batch-btn delete"
            onClick={() => handleBatchAction("delete")}
            disabled={selectedVoices.size === 0}
            aria-label={`Delete ${selectedVoices.size} selected voices`}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="pending-container">
        <div className="voices-table-container" onScroll={handleScroll}>
          <table className="voices-table" role="grid">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedVoices.size === voices.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVoices(new Set(voices.map((v) => v.id)));
                      } else {
                        setSelectedVoices(new Set());
                      }
                    }}
                    aria-label="Select all voices"
                  />
                </th>
                <th onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("created_at")}>
                  Date{" "}
                  {sortConfig.key === "created_at" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Content</th>
                <th>Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVoices.map((voice) => (
                <tr
                  key={voice.id}
                  className={selectedVoices.has(voice.id) ? "selected" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedVoices.has(voice.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedVoices);
                        if (e.target.checked) {
                          newSelected.add(voice.id);
                        } else {
                          newSelected.delete(voice.id);
                        }
                        setSelectedVoices(newSelected);
                      }}
                      aria-label={`Select voice from ${voice.name}`}
                    />
                  </td>
                  <td>{voice.name}</td>
                  <td>
                    <time dateTime={voice.created_at}>
                      {new Date(voice.created_at).toLocaleString()}
                    </time>
                  </td>
                  <td>
                    <div className="quote-preview">
                      {voice.quote.length > 100
                        ? `${voice.quote.substring(0, 100)}...`
                        : voice.quote}
                    </div>
                  </td>
                  <td>
                    <div className="media-preview">
                      {voice.image_url && (
                        <img
                          src={voice.image_url}
                          alt={`Image from ${voice.name}`}
                          loading="lazy"
                        />
                      )}
                      {voice.audio_url && (
                        <audio controls aria-label={`Audio from ${voice.name}`}>
                          <source src={voice.audio_url} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      {!voice.approved && (
                        <button
                          className="btn approve"
                          onClick={() => handleAction(voice.id, "approve")}
                          aria-label={`Approve voice from ${voice.name}`}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="btn delete"
                        onClick={() => handleAction(voice.id, "delete")}
                        aria-label={`Delete voice from ${voice.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="loading-indicator" role="status">
              <div className="loading-spinner"></div>
              <span>Loading more voices...</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div
          className="confirmation-dialog"
          role="dialog"
          aria-labelledby="confirm-title"
        >
          <div className="dialog-content">
            <h2 id="confirm-title">Confirm Action</h2>
            <p>
              Are you sure you want to {confirmAction.type}{" "}
              {confirmAction.count} selected voice
              {confirmAction.count > 1 ? "s" : ""}?
            </p>
            <div className="dialog-actions">
              <button
                className="btn"
                onClick={() => {
                  setIsConfirming(false);
                  setConfirmAction(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`btn ${confirmAction.type}`}
                onClick={executeBatchAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingVoices;
