import { useState, useEffect, useCallback } from "react";
import {
  HelpCircle,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  FileText,
} from "lucide-react";
import axios from "axios";

const API_BASE = "https://personalexpensetracker-backend-rph4.onrender.com/api";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "Income Query",
    message: "",
    transactionDetails: {
      transactionId: "",
      amount: "",
      date: "",
    },
  });

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/support/get`, {
        headers: getAuthHeaders(),
      });
      if (Array.isArray(res.data)) {
        setTickets(res.data);
      } else if (res.data?.success && Array.isArray(res.data?.data)) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Fetch support tickets error:", err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;

    try {
      setSubmitting(true);
      const payload = {
        subject: formData.subject.trim(),
        category: formData.category,
        message: formData.message.trim(),
        transactionDetails:
          formData.transactionDetails.transactionId || formData.transactionDetails.amount
            ? {
                transactionId: formData.transactionDetails.transactionId || null,
                amount: formData.transactionDetails.amount
                  ? parseFloat(formData.transactionDetails.amount)
                  : null,
                date: formData.transactionDetails.date || null,
              }
            : null,
      };

      await axios.post(`${API_BASE}/support/add`, payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });

      setFormData({
        subject: "",
        category: "Income Query",
        message: "",
        transactionDetails: { transactionId: "", amount: "", date: "" },
      });

      await fetchTickets();
    } catch (err) {
      console.error("Submit support ticket error:", err);
      const serverMsg = err?.response?.data?.message;
      alert(serverMsg || "Server error while submitting ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await axios.delete(`${API_BASE}/support/delete/${id}`, {
        headers: getAuthHeaders(),
      });
      await fetchTickets();
    } catch (err) {
      console.error("Delete support ticket error:", err);
      const serverMsg = err?.response?.data?.message;
      alert(serverMsg || "Server error while deleting ticket.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw size={12} className="animate-spin" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock size={12} /> Open
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-teal-600" />
            Support & Assistance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Have a query about an income or expense record? Submit a support request below.
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 font-medium transition-colors self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Ticket Submission Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-500" />
            Create New Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              >
                <option value="Income Query">Income Query</option>
                <option value="Expense Query">Expense Query</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Technical Issue">Technical Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Issue with Salary transaction entry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Message / Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your issue or request in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Optional Transaction Details Context */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-3">
              <span className="text-xs font-semibold text-teal-800 block">
                Related Transaction Context (Optional)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={formData.transactionDetails.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transactionDetails: {
                        ...formData.transactionDetails,
                        amount: e.target.value,
                      },
                    })
                  }
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="date"
                  value={formData.transactionDetails.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transactionDetails: {
                        ...formData.transactionDetails,
                        date: e.target.value,
                      },
                    })
                  }
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Support Tickets History List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            Your Support Tickets
          </h2>

          <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "520px" }}>
            {tickets.map((ticket) => (
              <div
                key={ticket._id || ticket.id}
                className="p-4 border border-gray-100 hover:border-teal-200 rounded-xl bg-gray-50/50 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                        {ticket.category}
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{ticket.subject}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteTicket(ticket._id || ticket.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{ticket.message}</p>

                {ticket.transactionDetails &&
                  (ticket.transactionDetails.amount || ticket.transactionDetails.date) && (
                    <div className="text-[11px] text-gray-500 bg-white p-2 rounded-lg border border-gray-100 flex items-center gap-3 mt-1">
                      {ticket.transactionDetails.amount && (
                        <span>
                          <strong>Amount:</strong> ₹{ticket.transactionDetails.amount}
                        </span>
                      )}
                      {ticket.transactionDetails.date && (
                        <span>
                          <strong>Date:</strong>{" "}
                          {new Date(ticket.transactionDetails.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                <div className="text-[11px] text-gray-400 pt-1">
                  Submitted on {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            ))}

            {tickets.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-teal-50 rounded-full text-teal-500 mb-3">
                  <AlertCircle size={28} />
                </div>
                <p className="text-sm font-medium text-gray-700">No support tickets found</p>
                <p className="text-xs text-gray-400 mt-1">
                  If you have any issues or queries, feel free to create a ticket.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;