import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  FileText,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";

import { protectedRequest } from "../services/api";

// =====================================================
// API
// =====================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090"
).replace(/\/$/, "");

// =====================================================
// STATUS OPTIONS
// =====================================================

const STATUS_OPTIONS = [
  "APPLIED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

const PIPELINE_STAGES = [
  "APPLIED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

// =====================================================
// STATUS LABEL
// =====================================================

function getStatusLabel(status) {
  const labels = {
    APPLIED: "Applied",
    SCREENING: "Screening",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    SELECTED: "Selected",
    REJECTED: "Rejected",
  };

  return labels[status] || status;
}

// =====================================================
// STATUS COLORS
// =====================================================

function getStatusClasses(status) {
  switch (status) {
    case "APPLIED":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "SCREENING":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    case "SHORTLISTED":
      return "bg-purple-50 text-purple-700 border border-purple-200";

    case "INTERVIEW":
      return "bg-orange-50 text-orange-700 border border-orange-200";

    case "SELECTED":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "REJECTED":
      return "bg-red-50 text-red-700 border border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

// =====================================================
// STATUS DOT COLORS
// =====================================================

function getStatusDot(status) {
  switch (status) {
    case "APPLIED":
      return "bg-blue-500";

    case "SCREENING":
      return "bg-yellow-500";

    case "SHORTLISTED":
      return "bg-purple-500";

    case "INTERVIEW":
      return "bg-orange-500";

    case "SELECTED":
      return "bg-blue-600";

    case "REJECTED":
      return "bg-red-500";

    default:
      return "bg-gray-400";
  }
}

// =====================================================
// RESPONSE HELPER
// =====================================================

async function parseResponse(response) {
  if (!response) {
    return null;
  }

  if (typeof response.json === "function") {
    return response.json();
  }

  return response;
}

// =====================================================
// APPLICATION HELPERS
// =====================================================

function getApplicationJob(application) {
  return application?.job || {};
}

function getCandidateName(application) {
  return (
    application?.fullName ||
    application?.applicantName ||
    application?.name ||
    application?.applicantEmail ||
    "Candidate"
  );
}

function getCandidateExperience(application) {
  return (
    application?.experience ||
    application?.yearsOfExperience ||
    application?.experienceYears ||
    "—"
  );
}

function getApplicationStatus(application) {
  return String(
    application?.status || "APPLIED"
  ).toUpperCase();
}

function getJobTitle(application) {
  const job = getApplicationJob(application);

  return (
    job?.title ||
    application?.jobTitle ||
    application?.position ||
    "—"
  );
}

function getApplicationDate(application) {
  return (
    application?.appliedAt ||
    application?.createdAt ||
    application?.applicationDate ||
    null
  );
}

// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// =====================================================
// EXPERIENCE FORMAT
// =====================================================

function formatExperience(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const text = String(value).trim();

  if (text === "—") {
    return "—";
  }

  if (
    text.toLowerCase().includes("year") ||
    text.toLowerCase().includes("month")
  ) {
    return text;
  }

  return `${text} years`;
}

// =====================================================
// AUTH TOKEN
// =====================================================

function getAuthToken(auth) {
  return (
    auth?.token ||
    auth?.accessToken ||
    localStorage.getItem("onus_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

// =====================================================
// COMPONENT
// =====================================================

export default function EmployerApplicants({ auth }) {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  // ===================================================
  // FILTER
  // ===================================================

  const [statusFilter, setStatusFilter] = useState("ALL");

  // ===================================================
  // ACTION MENU
  // ===================================================

  const [openActionMenu, setOpenActionMenu] =
    useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  // ===================================================
  // MODALS
  // ===================================================

  const [rejectApplication, setRejectApplication] =
    useState(null);

  const [selectApplication, setSelectApplication] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  // ===================================================
  // MESSAGE MODAL
  // ===================================================

  const [showMessageModal, setShowMessageModal] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [messageError, setMessageError] =
    useState("");

  const [messageSuccess, setMessageSuccess] =
    useState("");

  const [messageForm, setMessageForm] = useState({
    applicationId: null,
    candidateName: "",
    position: "",
    subject: "",
    message: "",
    interviewType: "",
    interviewDate: "",
    interviewTime: "",
    interviewLink: "",
    interviewLocation: "",
  });

  // ===================================================
  // LOADING
  // ===================================================

  const [updatingApplicationId, setUpdatingApplicationId] =
    useState(null);

  const [resumeLoadingId, setResumeLoadingId] =
    useState(null);

  // ===================================================
  // ACTION MENU REF
  // ===================================================

  const actionButtonRefs = useRef({});

  // ===================================================
  // LOAD APPLICATIONS
  // ===================================================

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await protectedRequest(
        "/api/applications/recruiter"
      );

      const data = await parseResponse(response);

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);

        setError(
          "Unable to load applications."
        );
      }
    } catch (err) {
      console.error(
        "Failed to load recruiter applications:",
        err
      );

      setError(
        err?.message ||
          "Failed to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadApplications();
  }, []);

  // ===================================================
  // FILTERED APPLICATIONS
  // ===================================================

  const filteredApplications = useMemo(() => {
    if (statusFilter === "ALL") {
      return applications;
    }

    return applications.filter(
      (application) =>
        getApplicationStatus(application) ===
        statusFilter
    );
  }, [applications, statusFilter]);

  // ===================================================
  // STATS
  // ===================================================

  const stats = useMemo(() => {
    const total = filteredApplications.length;

    const shortlisted =
      filteredApplications.filter((application) =>
        [
          "SHORTLISTED",
          "INTERVIEW",
          "SELECTED",
        ].includes(
          getApplicationStatus(application)
        )
      ).length;

    const interviews =
      filteredApplications.filter(
        (application) =>
          getApplicationStatus(application) ===
          "INTERVIEW"
      ).length;

    return {
      total,
      shortlisted,
      interviews,
    };
  }, [filteredApplications]);

  // ===================================================
  // PIPELINE COUNTS
  // ===================================================

  const pipelineCounts = useMemo(() => {
    return PIPELINE_STAGES.reduce(
      (result, stage) => {
        result[stage] =
          filteredApplications.filter(
            (application) =>
              getApplicationStatus(application) ===
              stage
          ).length;

        return result;
      },
      {}
    );
  }, [filteredApplications]);

  // ===================================================
  // UPDATE LOCAL APPLICATION
  // ===================================================

  const updateApplicationLocally = (
    updatedApplication
  ) => {
    if (!updatedApplication?.id) {
      return;
    }

    setApplications(
      (currentApplications) =>
        currentApplications.map(
          (application) =>
            application.id ===
            updatedApplication.id
              ? {
                  ...application,
                  ...updatedApplication,
                }
              : application
        )
    );
  };

  // ===================================================
  // POSITION ACTION MENU
  // ===================================================

  const openMenu = (
    event,
    applicationId
  ) => {
    event.stopPropagation();

    const button =
      actionButtonRefs.current[
        applicationId
      ];

    if (!button) {
      return;
    }

    const rect =
      button.getBoundingClientRect();

    const menuWidth = 240;

    const menuEstimatedHeight = 410;

    let left =
      rect.right - menuWidth;

    if (left < 10) {
      left = 10;
    }

    if (
      left + menuWidth >
      window.innerWidth - 10
    ) {
      left =
        window.innerWidth -
        menuWidth -
        10;
    }

    let top = rect.bottom + 8;

    if (
      top + menuEstimatedHeight >
      window.innerHeight - 10
    ) {
      top =
        rect.top -
        menuEstimatedHeight -
        8;
    }

    if (top < 10) {
      top = 10;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenActionMenu(
      (current) =>
        current === applicationId
          ? null
          : applicationId
    );
  };

  // ===================================================
  // CLOSE MENU
  // ===================================================

  const closeMenu = () => {
    setOpenActionMenu(null);
  };

  // ===================================================
  // NORMAL STATUS CHANGE
  // ===================================================

  const handleNormalStatusChange = async (
    application,
    status
  ) => {
    if (!application?.id) {
      return;
    }

    closeMenu();

    setActionError("");

    // -----------------------------------------------
    // REJECT
    // -----------------------------------------------

    if (status === "REJECTED") {
      setRejectionReason("");

      setRejectApplication(application);

      return;
    }

    // -----------------------------------------------
    // SELECT
    // -----------------------------------------------

    if (status === "SELECTED") {
      setSelectApplication(application);

      return;
    }

    // -----------------------------------------------
    // NORMAL STATUS
    // -----------------------------------------------

    try {
      setUpdatingApplicationId(
        application.id
      );

      const response =
        await protectedRequest(
          `/api/applications/recruiter/${application.id}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await parseResponse(response);

      if (
        response &&
        "ok" in response &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
            "Failed to update application status."
        );
      }

      if (data?.id) {
        updateApplicationLocally(data);
      } else {
        await loadApplications();
      }
    } catch (err) {
      console.error(
        "Status update failed:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  // ===================================================
  // CONFIRM SELECTION
  // ===================================================

  const confirmSelection = async () => {
    if (!selectApplication?.id) {
      return;
    }

    try {
      setUpdatingApplicationId(
        selectApplication.id
      );

      setActionError("");

      const response =
        await protectedRequest(
          `/api/applications/recruiter/${selectApplication.id}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: "SELECTED",
            }),
          }
        );

      const data =
        await parseResponse(response);

      if (
        response &&
        "ok" in response &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
            "Failed to select candidate."
        );
      }

      if (data?.id) {
        updateApplicationLocally(data);
      } else {
        await loadApplications();
      }

      setSelectApplication(null);
    } catch (err) {
      console.error(
        "Candidate selection failed:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to select candidate."
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  // ===================================================
  // CONFIRM REJECTION
  // ===================================================

  const confirmRejection = async () => {
    if (!rejectApplication?.id) {
      return;
    }

    const reason =
      rejectionReason.trim();

    if (!reason) {
      setActionError(
        "Rejection reason is required."
      );

      return;
    }

    if (reason.length > 2000) {
      setActionError(
        "Rejection reason cannot be longer than 2000 characters."
      );

      return;
    }

    try {
      setUpdatingApplicationId(
        rejectApplication.id
      );

      setActionError("");

      const response =
        await protectedRequest(
          `/api/applications/recruiter/${rejectApplication.id}/reject`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              rejectionReason:
                reason,
            }),
          }
        );

      const data =
        await parseResponse(response);

      if (
        response &&
        "ok" in response &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
            "Failed to reject candidate."
        );
      }

      if (data?.id) {
        updateApplicationLocally(data);
      } else {
        await loadApplications();
      }

      setRejectApplication(null);

      setRejectionReason("");
    } catch (err) {
      console.error(
        "Candidate rejection failed:",
        err
      );

      setActionError(
        err?.message ||
          "Failed to reject candidate."
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  // ===================================================
  // MESSAGE
  // ===================================================

  const handleMessage = (
    application
  ) => {
    closeMenu();

    const candidateName =
      getCandidateName(application);

    const position =
      getJobTitle(application);

    const isInterview =
      getApplicationStatus(application) ===
      "INTERVIEW";

    setMessageError("");

    setMessageForm({
      applicationId:
        application?.id || null,

      candidateName,

      position,

      subject: isInterview
        ? `Interview Invitation - ${position}`
        : "",

      message: isInterview
        ? `Hello ${candidateName},

We would like to invite you for an interview for the ${position} position.

Please find the interview details below.`
        : "",

      interviewType: "",

      interviewDate: "",

      interviewTime: "",

      interviewLink: "",

      interviewLocation: "",
    });

    setShowMessageModal(true);
  };

  // ===================================================
  // MESSAGE FORM CHANGE
  // ===================================================

  const handleMessageFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setMessageForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setMessageError("");
  };

  // ===================================================
  // CLOSE MESSAGE MODAL
  // ===================================================

  const closeMessageModal = () => {
    if (sendingMessage) {
      return;
    }

    setShowMessageModal(false);

    setMessageError("");
  };

  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const sendMessageToCandidate = async (
    event
  ) => {
    event.preventDefault();

    setMessageError("");

    if (!messageForm.applicationId) {
      setMessageError(
        "Application ID is missing."
      );

      return;
    }

    if (!messageForm.subject.trim()) {
      setMessageError(
        "Subject is required."
      );

      return;
    }

    if (!messageForm.message.trim()) {
      setMessageError(
        "Message is required."
      );

      return;
    }

    // -----------------------------------------------
    // INTERVIEW VALIDATION
    // -----------------------------------------------

    if (messageForm.interviewType) {
      if (!messageForm.interviewDate) {
        setMessageError(
          "Interview date is required."
        );

        return;
      }

      if (!messageForm.interviewTime) {
        setMessageError(
          "Interview time is required."
        );

        return;
      }

      if (
        messageForm.interviewType ===
          "ONLINE" &&
        !messageForm.interviewLink.trim()
      ) {
        setMessageError(
          "Interview link is required for online interview."
        );

        return;
      }

      if (
        messageForm.interviewType ===
          "OFFLINE" &&
        !messageForm.interviewLocation.trim()
      ) {
        setMessageError(
          "Interview location is required for offline interview."
        );

        return;
      }
    }

    try {
      setSendingMessage(true);

      const response =
        await protectedRequest(
          "/api/messages/recruiter/send",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              applicationId: String(
                messageForm.applicationId
              ),

              subject:
                messageForm.subject.trim(),

              message:
                messageForm.message.trim(),

              interviewType:
                messageForm.interviewType ||
                "",

              interviewDate:
                messageForm.interviewDate ||
                "",

              interviewTime:
                messageForm.interviewTime ||
                "",

              interviewLink:
                messageForm.interviewType ===
                "ONLINE"
                  ? messageForm.interviewLink.trim()
                  : "",

              interviewLocation:
                messageForm.interviewType ===
                "OFFLINE"
                  ? messageForm.interviewLocation.trim()
                  : "",
            }),
          }
        );

      const data =
        await parseResponse(response);

      if (
        response &&
        "ok" in response &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
            "Failed to send message."
        );
      }

      setShowMessageModal(false);

      setMessageForm({
        applicationId: null,
        candidateName: "",
        position: "",
        subject: "",
        message: "",
        interviewType: "",
        interviewDate: "",
        interviewTime: "",
        interviewLink: "",
        interviewLocation: "",
      });

      setMessageSuccess(
        "Message sent successfully."
      );

      setTimeout(() => {
        setMessageSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Message sending failed:",
        err
      );

      setMessageError(
        err?.message ||
          "Failed to send message."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // ===================================================
  // VIEW RESUME
  // ===================================================

  const handleViewResume = async (
    application
  ) => {
    if (!application?.id) {
      return;
    }

    closeMenu();

    setActionError("");

    const token =
      getAuthToken(auth);

    if (!token) {
      setActionError(
        "Authentication token not found."
      );

      return;
    }

    const resumeWindow =
      window.open(
        "",
        "_blank"
      );

    try {
      setResumeLoadingId(
        application.id
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/applications/recruiter/${application.id}/resume/view`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        let message =
          "Unable to open resume.";

        try {
          const data =
            await response.json();

          if (data?.message) {
            message =
              data.message;
          }
        } catch {
          // Not JSON.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      const blobUrl =
        URL.createObjectURL(blob);

      if (resumeWindow) {
        resumeWindow.location.href =
          blobUrl;
      } else {
        window.open(
          blobUrl,
          "_blank"
        );
      }

      setTimeout(() => {
        URL.revokeObjectURL(
          blobUrl
        );
      }, 60000);
    } catch (err) {
      console.error(
        "Resume opening failed:",
        err
      );

      if (resumeWindow) {
        resumeWindow.close();
      }

      setActionError(
        err?.message ||
          "Unable to open resume."
      );
    } finally {
      setResumeLoadingId(null);
    }
  };

  // ===================================================
  // CLICK OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenActionMenu(null);
    };

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOpenActionMenu(null);

        if (
          showMessageModal &&
          !sendingMessage
        ) {
          setShowMessageModal(false);
        }
      }
    };

    window.addEventListener(
      "click",
      handleOutsideClick
    );

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "click",
        handleOutsideClick
      );

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showMessageModal,
    sendingMessage,
  ]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Applicants
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage candidates who have applied to your jobs.
            </p>
          </div>

          {/* ERROR */}

          {(error || actionError) && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1">
                {actionError || error}
              </div>

              {actionError && (
                <button
                  type="button"
                  onClick={() =>
                    setActionError("")
                  }
                  className="rounded p-1 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* SUCCESS */}

          {messageSuccess && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />

              {messageSuccess}
            </div>
          )}

          {/* STATS */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Applications
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Shortlisted
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.shortlisted}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Interviews
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.interviews}
              </p>
            </div>

          </div>

          {/* FILTER */}

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Filter className="h-4 w-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Filter Applicants
                  </p>

                  <p className="text-xs text-gray-500">
                    Select one status to view matching candidates.
                  </p>
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {getStatusLabel(
                        status
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            {statusFilter !== "ALL" && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Showing:
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      statusFilter
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                        statusFilter
                      )}`}
                    />

                    {getStatusLabel(
                      statusFilter
                    )}
                  </span>

                  <span className="text-xs text-gray-500">
                    ({filteredApplications.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setStatusFilter("ALL")
                  }
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* TABLE */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  All Applicants
                </h2>

                {statusFilter !== "ALL" && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Showing only{" "}
                    {getStatusLabel(
                      statusFilter
                    ).toLowerCase()}{" "}
                    candidates
                  </p>
                )}
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {filteredApplications.length}{" "}
                {filteredApplications.length ===
                1
                  ? "Candidate"
                  : "Candidates"}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading applicants...
              </div>
            ) : filteredApplications.length ===
              0 ? (
              <div className="py-16 text-center">

                <FileText className="mx-auto h-10 w-10 text-gray-400" />

                <h3 className="mt-3 text-sm font-semibold text-gray-900">
                  No applicants found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  No candidates match the selected status.
                </p>

                {statusFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() =>
                      setStatusFilter("ALL")
                    }
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Show All Applicants
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">

                  <thead className="bg-gray-50">
                    <tr>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Candidate
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Position
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Experience
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Applied
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {filteredApplications.map(
                      (application) => {
                        const status =
                          getApplicationStatus(
                            application
                          );

                        const isUpdating =
                          updatingApplicationId ===
                          application.id;

                        const isResumeLoading =
                          resumeLoadingId ===
                          application.id;

                        return (
                          <tr
                            key={
                              application.id
                            }
                            className="hover:bg-gray-50"
                          >

                            {/* CANDIDATE */}

                            <td className="whitespace-nowrap px-5 py-4">
                              <div>

                                <p className="font-medium text-gray-900">
                                  {getCandidateName(
                                    application
                                  )}
                                </p>

                                {application?.applicantEmail && (
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {
                                      application.applicantEmail
                                    }
                                  </p>
                                )}

                              </div>
                            </td>

                            {/* POSITION */}

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              {getJobTitle(
                                application
                              )}
                            </td>

                            {/* EXPERIENCE */}

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              {formatExperience(
                                getCandidateExperience(
                                  application
                                )
                              )}
                            </td>

                            {/* STATUS */}

                            <td className="whitespace-nowrap px-5 py-4">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                  status
                                )}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                    status
                                  )}`}
                                />

                                {getStatusLabel(
                                  status
                                )}
                              </span>

                            </td>

                            {/* APPLIED */}

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                              {formatDate(
                                getApplicationDate(
                                  application
                                )
                              )}
                            </td>

                            {/* ACTIONS */}

                            <td className="whitespace-nowrap px-5 py-4 text-right">

                              <button
                                ref={(element) => {
                                  actionButtonRefs.current[
                                    application.id
                                  ] = element;
                                }}
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={(event) =>
                                  openMenu(
                                    event,
                                    application.id
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    Actions

                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform ${
                                        openActionMenu ===
                                        application.id
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </>
                                )}
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* HIRING PIPELINE */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Hiring Pipeline
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track candidates through every hiring stage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

              {PIPELINE_STAGES.map(
                (stage, index) => (
                  <div
                    key={stage}
                    className={`relative rounded-xl border p-4 ${getStatusClasses(
                      stage
                    )}`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <span
                          className={`h-2 w-2 rounded-full ${getStatusDot(
                            stage
                          )}`}
                        />

                        <p className="text-sm font-medium">
                          {getStatusLabel(
                            stage
                          )}
                        </p>

                      </div>

                      <span className="text-2xl font-bold">
                        {pipelineCounts[
                          stage
                        ] || 0}
                      </span>

                    </div>

                    {index <
                      PIPELINE_STAGES.length -
                        1 && (
                      <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                        <span className="text-gray-300">
                          →
                        </span>
                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          </div>

        </div>
      </main>

      {/* =================================================
          ACTION MENU
      ================================================= */}

      {openActionMenu !== null && (
        <div
          onClick={(event) =>
            event.stopPropagation()
          }
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          className="z-[9999] w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-2xl"
        >
          {(() => {
            const application =
              applications.find(
                (item) =>
                  item.id ===
                  openActionMenu
              );

            if (!application) {
              return null;
            }

            const status =
              getApplicationStatus(
                application
              );

            const isResumeLoading =
              resumeLoadingId ===
              application.id;

            return (
              <>
                {/* RESUME */}

                <button
                  type="button"
                  onClick={() =>
                    handleViewResume(
                      application
                    )
                  }
                  disabled={
                    isResumeLoading
                  }
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
                >
                  {isResumeLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}

                  View Resume
                </button>

                {/* MESSAGE */}

                <button
                  type="button"
                  onClick={() =>
                    handleMessage(
                      application
                    )
                  }
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                >
                  <MessageCircle className="h-4 w-4 text-purple-600" />

                  Message
                </button>

                <div className="my-1 border-t border-gray-100" />

                {/* TITLE */}

                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Change Status
                </p>

                {/* STATUS OPTIONS */}

                {STATUS_OPTIONS.map(
                  (statusOption) => {
                    const isCurrent =
                      status ===
                      statusOption;

                    return (
                      <button
                        key={
                          statusOption
                        }
                        type="button"
                        disabled={
                          isCurrent
                        }
                        onClick={() =>
                          handleNormalStatusChange(
                            application,
                            statusOption
                          )
                        }
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                          isCurrent
                            ? "cursor-default bg-gray-50 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${getStatusDot(
                              statusOption
                            )}`}
                          />

                          <span
                            className={
                              isCurrent
                                ? "text-gray-400"
                                : ""
                            }
                          >
                            {getStatusLabel(
                              statusOption
                            )}
                          </span>

                        </span>

                        {isCurrent && (
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              statusOption ===
                              "REJECTED"
                                ? "text-red-500"
                                : statusOption ===
                                  "SELECTED"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        )}

                      </button>
                    );
                  }
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* =================================================
          MESSAGE MODAL
      ================================================= */}

      {showMessageModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeMessageModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Message Candidate
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {messageForm.candidateName}
                  {" • "}
                  {messageForm.position}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeMessageModal
                }
                disabled={
                  sendingMessage
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* BODY */}

            <form
              onSubmit={
                sendMessageToCandidate
              }
            >
              <div className="space-y-5 px-5 py-5">

                {/* ERROR */}

                {messageError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                      {messageError}
                    </span>
                  </div>
                )}

                {/* SUBJECT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject *
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={
                      messageForm.subject
                    }
                    onChange={
                      handleMessageFormChange
                    }
                    placeholder="Enter message subject"
                    disabled={
                      sendingMessage
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* MESSAGE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Message *
                  </label>

                  <textarea
                    name="message"
                    value={
                      messageForm.message
                    }
                    onChange={
                      handleMessageFormChange
                    }
                    rows={7}
                    placeholder="Write your message..."
                    disabled={
                      sendingMessage
                    }
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* INTERVIEW TYPE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Interview Details
                  </label>

                  <select
                    name="interviewType"
                    value={
                      messageForm.interviewType
                    }
                    onChange={
                      handleMessageFormChange
                    }
                    disabled={
                      sendingMessage
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">
                      No interview details
                    </option>

                    <option value="ONLINE">
                      Online Interview
                    </option>

                    <option value="OFFLINE">
                      Offline Interview
                    </option>
                  </select>
                </div>

                {/* INTERVIEW DETAILS */}

                {messageForm.interviewType && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      {/* DATE */}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Interview Date *
                        </label>

                        <input
                          type="date"
                          name="interviewDate"
                          value={
                            messageForm.interviewDate
                          }
                          onChange={
                            handleMessageFormChange
                          }
                          disabled={
                            sendingMessage
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* TIME */}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Interview Time *
                        </label>

                        <input
                          type="time"
                          name="interviewTime"
                          value={
                            messageForm.interviewTime
                          }
                          onChange={
                            handleMessageFormChange
                          }
                          disabled={
                            sendingMessage
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                    </div>

                    {/* ONLINE */}

                    {messageForm.interviewType ===
                      "ONLINE" && (
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Meeting Link *
                        </label>

                        <input
                          type="url"
                          name="interviewLink"
                          value={
                            messageForm.interviewLink
                          }
                          onChange={
                            handleMessageFormChange
                          }
                          placeholder="https://meet.google.com/..."
                          disabled={
                            sendingMessage
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* OFFLINE */}

                    {messageForm.interviewType ===
                      "OFFLINE" && (
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Interview Location *
                        </label>

                        <input
                          type="text"
                          name="interviewLocation"
                          value={
                            messageForm.interviewLocation
                          }
                          onChange={
                            handleMessageFormChange
                          }
                          placeholder="Enter interview location"
                          disabled={
                            sendingMessage
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">

                <button
                  type="button"
                  onClick={
                    closeMessageModal
                  }
                  disabled={
                    sendingMessage
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    sendingMessage
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingMessage && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {sendingMessage
                    ? "Sending..."
                    : "Send Message"}
                </button>

              </div>
            </form>

          </div>
        </div>
      )}

      {/* =================================================
          REJECT MODAL
      ================================================= */}

      {rejectApplication && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <h3 className="text-lg font-semibold text-gray-900">
                Reject Candidate
              </h3>

              <button
                type="button"
                onClick={() => {
                  if (
                    !updatingApplicationId
                  ) {
                    setRejectApplication(
                      null
                    );

                    setRejectionReason(
                      ""
                    );

                    setActionError(
                      ""
                    );
                  }
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-4 px-5 py-5">

              <div>
                <p className="text-sm text-gray-500">
                  Candidate:
                </p>

                <p className="font-medium text-gray-900">
                  {getCandidateName(
                    rejectApplication
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Position:
                </p>

                <p className="font-medium text-gray-900">
                  {getJobTitle(
                    rejectApplication
                  )}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reason for rejection *
                </label>

                <textarea
                  value={
                    rejectionReason
                  }
                  onChange={(
                    event
                  ) => {
                    setRejectionReason(
                      event.target.value
                    );

                    setActionError(
                      ""
                    );
                  }}
                  rows={5}
                  maxLength={2000}
                  placeholder="Please provide reason..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />

                <div className="mt-1 text-right text-xs text-gray-400">
                  {
                    rejectionReason.length
                  }
                  /2000
                </div>
              </div>

              {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionError}
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">

              <button
                type="button"
                disabled={
                  !!updatingApplicationId
                }
                onClick={() => {
                  setRejectApplication(
                    null
                  );

                  setRejectionReason(
                    ""
                  );

                  setActionError(
                    ""
                  );
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !!updatingApplicationId ||
                  !rejectionReason.trim()
                }
                onClick={
                  confirmRejection
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingApplicationId ===
                rejectApplication.id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rejecting...
                  </span>
                ) : (
                  "Reject Candidate"
                )}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SELECT MODAL
      ================================================= */}

      {selectApplication && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <h3 className="text-lg font-semibold text-gray-900">
                Select Candidate
              </h3>

              <button
                type="button"
                onClick={() => {
                  if (
                    !updatingApplicationId
                  ) {
                    setSelectApplication(
                      null
                    );

                    setActionError(
                      ""
                    );
                  }
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="px-5 py-6">

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Candidate:
                  </p>

                  <p className="font-medium text-gray-900">
                    {getCandidateName(
                      selectApplication
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Position:
                  </p>

                  <p className="font-medium text-gray-900">
                    {getJobTitle(
                      selectApplication
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-5 text-center">

                  <CheckCircle2 className="mx-auto h-10 w-10 text-blue-600" />

                  <p className="mt-2 text-lg font-semibold text-blue-700">
                    Congratulations!
                  </p>

                  <p className="mt-1 text-sm text-blue-600">
                    This candidate will be marked as selected.
                  </p>

                </div>

              </div>

              {actionError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionError}
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">

              <button
                type="button"
                disabled={
                  !!updatingApplicationId
                }
                onClick={() => {
                  setSelectApplication(
                    null
                  );

                  setActionError(
                    ""
                  );
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !!updatingApplicationId
                }
                onClick={
                  confirmSelection
                }
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingApplicationId ===
                selectApplication.id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Selecting...
                  </span>
                ) : (
                  "Confirm Selection"
                )}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}