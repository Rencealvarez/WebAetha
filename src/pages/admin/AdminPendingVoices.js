import React, { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminPendingVoices.css";

const AdminPendingVoices = () => {
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [userSearch, setUserSearch] = useState("");
  const [showSpamOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [selectedVoices, setSelectedVoices] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [profilesById, setProfilesById] = useState({});
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

        // Apply search (by public name/quote)
        if (searchTerm) {
          query = query.or(
            `name.ilike.%${searchTerm}%,quote.ilike.%${searchTerm}%`
          );
        }

        // Apply spam-only filter
        if (showSpamOnly) {
          query = query.eq("suspected_spam", true);
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
        // Fetch related profiles for real names/emails (based only on new data)
        const userIds = Array.from(
          new Set(data.map((v) => v.user_id).filter(Boolean))
        );
        if (userIds.length > 0) {
          const { data: profs, error: profErr } = await supabase
            .from("user_profiles")
            .select("id, full_name, email")
            .in("id", userIds);
          if (!profErr && profs) {
            setProfilesById((prev) => {
              const merged = { ...prev };
              profs.forEach((p) => {
                merged[p.id] = p;
              });
              return merged;
            });
          }
        } else {
          // no-op; keep existing cached profiles to avoid UI flicker
        }
        setHasMore(count > pageNum * ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err) {
        setError("Failed to fetch voices. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, sortConfig, showSpamOnly]
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
      } else if (action === "mark_spam") {
        await supabase
          .from("local_voices")
          .update({ suspected_spam: true })
          .in("id", ids);
      } else if (action === "unmark_spam") {
        await supabase
          .from("local_voices")
          .update({ suspected_spam: false })
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
      } else if (action === "mark_spam") {
        await supabase
          .from("local_voices")
          .update({ suspected_spam: true })
          .eq("id", id);
      } else if (action === "unmark_spam") {
        await supabase
          .from("local_voices")
          .update({ suspected_spam: false })
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

  // Client-side filter by user profile (real name/email), then sort
  const filteredAndSortedVoices = useMemo(() => {
    const byUser = userSearch.trim().toLowerCase();
    const filtered = byUser
      ? voices.filter((v) => {
          const p = profilesById[v.user_id] || {};
          const fn = (p.full_name || "").toLowerCase();
          const em = (p.email || "").toLowerCase();
          return fn.includes(byUser) || em.includes(byUser);
        })
      : voices;
    return [...filtered].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [voices, profilesById, userSearch, sortConfig]);

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
          <input
            type="search"
            placeholder="Filter by real name or email"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            aria-label="Filter by user profile"
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
          <span className="selected-count">
            {selectedVoices.size > 0 ? `${selectedVoices.size} selected` : ""}
          </span>
          <button
            className="btn batch-btn"
            onClick={() => handleBatchAction("approve")}
            disabled={selectedVoices.size === 0}
            aria-label={`Approve ${selectedVoices.size} selected voices`}
          >
            Approve Selected
          </button>
          <button
            className="btn batch-btn"
            onClick={() => handleBatchAction("mark_spam")}
            disabled={selectedVoices.size === 0}
            aria-label={`Mark ${selectedVoices.size} selected voices as spam`}
          >
            Mark Spam
          </button>
          <button
            className="btn batch-btn"
            onClick={() => handleBatchAction("unmark_spam")}
            disabled={selectedVoices.size === 0}
            aria-label={`Unmark ${selectedVoices.size} selected voices as spam`}
          >
            Unmark Spam
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
                    checked={
                      filteredAndSortedVoices.length > 0 &&
                      selectedVoices.size === filteredAndSortedVoices.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVoices(
                          new Set(filteredAndSortedVoices.map((v) => v.id))
                        );
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
                <th>Real User</th>
                <th onClick={() => handleSort("created_at")}>
                  Date{" "}
                  {sortConfig.key === "created_at" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Content</th>
                <th>Media</th>
                <th>Spam</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedVoices.map((voice) => (
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
                    {profilesById[voice.user_id] ? (
                      <div className="real-user">
                        <div className="full-name">
                          {profilesById[voice.user_id].full_name}
                        </div>
                        <div className="email">
                          {profilesById[voice.user_id].email}
                        </div>
                      </div>
                    ) : (
                      <span className="muted">Unknown</span>
                    )}
                  </td>
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
                    {voice.suspected_spam ? (
                      <span className="tag tag-spam">Spam</span>
                    ) : (
                      <span className="tag tag-clean">Clean</span>
                    )}
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
                      {voice.suspected_spam ? (
                        <button
                          className="btn"
                          onClick={() => handleAction(voice.id, "unmark_spam")}
                          aria-label={`Unmark spam for ${voice.name}`}
                        >
                          Unmark Spam
                        </button>
                      ) : (
                        <button
                          className="btn"
                          onClick={() => handleAction(voice.id, "mark_spam")}
                          aria-label={`Mark as spam for ${voice.name}`}
                        >
                          Mark Spam
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
              {filteredAndSortedVoices.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No voices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
