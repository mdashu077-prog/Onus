import { useEffect, useState } from "react";
import {
  MessageCircle,
  Mail,
  CalendarDays,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Inbox,
} from "lucide-react";

import { protectedRequest } from "../services/api";


// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090"
).replace(/\/$/, "");


// =====================================================
// RESPONSE HELPER
// =====================================================

async function parseResponse(response) {
  if (!response) {
    return null;
  }

  if (typeof response.json === "function") {
    return await response.json();
  }

  return response;
}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  try {
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateValue;
  }
}


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(timeValue) {
  if (!timeValue) {
    return "";
  }

  return timeValue;
}


// =====================================================
// INTERVIEW TYPE
// =====================================================

function getInterviewType(message) {
  return (message?.interviewType || "").toUpperCase();
}


// =====================================================
// COMPONENT
// =====================================================

function Messages({ auth }) {

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [markingRead, setMarkingRead] =
    useState(false);


  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  async function loadMessages() {

    try {

      setLoading(true);
      setError("");

      const response = await protectedRequest(
        "/api/messages/my",
        {
          method: "GET",
        }
      );

      const data = await parseResponse(response);

      if (
        response &&
        typeof response.ok === "boolean" &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
          "Failed to load messages."
        );
      }

      if (Array.isArray(data)) {

        setMessages(data);

      } else {

        setMessages([]);
      }

    } catch (err) {

      console.error(
        "Failed to load messages:",
        err
      );

      setError(
        err?.message ||
        "Unable to load messages."
      );

    } finally {

      setLoading(false);
    }
  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadMessages();

  }, []);


  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = messages.filter(
    (message) =>
      message?.read === false ||
      message?.read === 0
  ).length;


  // =====================================================
  // OPEN MESSAGE
  // =====================================================

  async function openMessage(message) {

    setSelectedMessage(message);

    const isUnread =
      message?.read === false ||
      message?.read === 0;

    if (!isUnread || !message?.id) {
      return;
    }

    try {

      setMarkingRead(true);

      const response = await protectedRequest(
        `/api/messages/${message.id}/read`,
        {
          method: "PUT",
        }
      );

      const data = await parseResponse(response);

      if (
        response &&
        typeof response.ok === "boolean" &&
        !response.ok
      ) {
        throw new Error(
          data?.message ||
          "Unable to mark message as read."
        );
      }

      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item.id === message.id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );

      setSelectedMessage((previous) =>
        previous
          ? {
              ...previous,
              read: true,
            }
          : previous
      );

    } catch (err) {

      console.error(
        "Failed to mark message as read:",
        err
      );

    } finally {

      setMarkingRead(false);
    }
  }


  // =====================================================
  // CLOSE MESSAGE
  // =====================================================

  function closeMessage() {

    setSelectedMessage(null);
  }


  // =====================================================
  // REFRESH
  // =====================================================

  function handleRefresh() {

    loadMessages();
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-6xl">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <Loader2
                className="h-8 w-8 animate-spin text-blue-600"
              />

              <p className="text-sm text-gray-500">
                Loading messages...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <MessageCircle
              className="mx-auto mb-4 h-12 w-12 text-red-400"
            />

            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load messages
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // SELECTED MESSAGE VIEW
  // =====================================================

  if (selectedMessage) {

    const interviewType =
      getInterviewType(selectedMessage);

    const isOnline =
      interviewType === "ONLINE";

    const isOffline =
      interviewType === "OFFLINE";

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-4xl">

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={closeMessage}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Messages
          </button>


          {/* =================================================
              MESSAGE CARD
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-gray-200 bg-white p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                    <MessageCircle
                      className="h-6 w-6 text-blue-600"
                    />

                  </div>

                  <div>

                    <h1 className="text-xl font-semibold text-gray-900">
                      {selectedMessage.subject ||
                        "Message"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                      From:{" "}
                      <span className="font-medium text-gray-700">
                        {selectedMessage.senderEmail ||
                          "Recruiter"}
                      </span>
                    </p>

                  </div>

                </div>

                {selectedMessage.read ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">

                    <CheckCircle2 className="h-3.5 w-3.5" />

                    Read

                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                    <Circle className="h-3.5 w-3.5 fill-current" />

                    Unread

                  </span>
                )}

              </div>


              {/* =================================================
                  DATE
              ================================================= */}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">

                <CalendarDays className="h-4 w-4" />

                {formatDate(
                  selectedMessage.createdAt
                )}

                {selectedMessage.createdAt && (
                  <>
                    <span>•</span>

                    {new Date(
                      selectedMessage.createdAt
                    ).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                )}

                {markingRead && (
                  <>
                    <span>•</span>

                    <span className="text-blue-600">
                      Updating...
                    </span>
                  </>
                )}

              </div>

            </div>


            {/* =================================================
                MESSAGE BODY
            ================================================= */}

            <div className="p-6">

              <div className="whitespace-pre-wrap rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
                {selectedMessage.message}
              </div>


              {/* =================================================
                  INTERVIEW DETAILS
              ================================================= */}

              {(isOnline || isOffline) && (

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">

                  <div className="mb-4 flex items-center gap-2">

                    {isOnline ? (
                      <Video className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MapPin className="h-5 w-5 text-blue-600" />
                    )}

                    <h2 className="text-base font-semibold text-gray-900">
                      Interview Details
                    </h2>

                  </div>


                  {/* =================================================
                      INTERVIEW TYPE
                  ================================================= */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl bg-white p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Interview Type
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {isOnline
                          ? "Online"
                          : "Offline"}
                      </p>

                    </div>


                    {/* =================================================
                        DATE
                    ================================================= */}

                    <div className="rounded-xl bg-white p-4">

                      <div className="flex items-center gap-2">

                        <CalendarDays className="h-4 w-4 text-blue-600" />

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Date
                        </p>

                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {selectedMessage.interviewDate ||
                          "Not provided"}
                      </p>

                    </div>


                    {/* =================================================
                        TIME
                    ================================================= */}

                    <div className="rounded-xl bg-white p-4">

                      <div className="flex items-center gap-2">

                        <Clock className="h-4 w-4 text-blue-600" />

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Time
                        </p>

                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatTime(
                          selectedMessage.interviewTime
                        ) || "Not provided"}
                      </p>

                    </div>


                    {/* =================================================
                        ONLINE LINK
                    ================================================= */}

                    {isOnline &&
                      selectedMessage.interviewLink && (

                        <div className="rounded-xl bg-white p-4 sm:col-span-2">

                          <div className="flex items-center gap-2">

                            <Video className="h-4 w-4 text-blue-600" />

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Meeting Link
                            </p>

                          </div>

                          <a
                            href={
                              selectedMessage.interviewLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Join Interview

                            <ExternalLink className="h-4 w-4" />
                          </a>

                        </div>
                      )}


                    {/* =================================================
                        OFFLINE LOCATION
                    ================================================= */}

                    {isOffline &&
                      selectedMessage.interviewLocation && (

                        <div className="rounded-xl bg-white p-4 sm:col-span-2">

                          <div className="flex items-center gap-2">

                            <MapPin className="h-4 w-4 text-blue-600" />

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Interview Location
                            </p>

                          </div>

                          <p className="mt-2 text-sm font-medium leading-6 text-gray-800">
                            {selectedMessage.interviewLocation}
                          </p>

                        </div>
                      )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN MESSAGES LIST
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <MessageCircle
                  className="h-6 w-6 text-blue-600"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-900">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Messages and interview updates from recruiters
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            Refresh
          </button>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Messages
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {messages.length}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                <Inbox
                  className="h-5 w-5 text-blue-600"
                />

              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Unread Messages
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {unreadCount}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                <Mail
                  className="h-5 w-5 text-blue-600"
                />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {messages.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">

              <MessageCircle
                className="h-8 w-8 text-gray-400"
              />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No messages yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              When a recruiter sends you a message or interview invitation,
              it will appear here.
            </p>

          </div>

        ) : (

          /* =================================================
             MESSAGE LIST
          ================================================= */

          <div className="space-y-3">

            {messages.map((message) => {

              const isUnread =
                message?.read === false ||
                message?.read === 0;

              const interviewType =
                getInterviewType(message);

              const hasInterview =
                interviewType === "ONLINE" ||
                interviewType === "OFFLINE";

              return (

                <button
                  key={message.id}
                  type="button"
                  onClick={() => openMessage(message)}
                  className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md ${
                    isUnread
                      ? "border-blue-200"
                      : "border-gray-200"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isUnread
                          ? "bg-blue-50"
                          : "bg-gray-50"
                      }`}
                    >

                      <MessageCircle
                        className={`h-5 w-5 ${
                          isUnread
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2
                              className={`truncate text-base ${
                                isUnread
                                  ? "font-bold text-gray-900"
                                  : "font-semibold text-gray-800"
                              }`}
                            >
                              {message.subject ||
                                "Message"}
                            </h2>

                            {isUnread && (

                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                New
                              </span>

                            )}

                          </div>

                          <p className="mt-1 text-xs text-gray-500">
                            {message.senderEmail ||
                              "Recruiter"}
                          </p>

                        </div>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <div className="shrink-0 text-xs text-gray-400">

                          {formatDate(
                            message.createdAt
                          )}

                        </div>

                      </div>


                      {/* =================================================
                          MESSAGE PREVIEW
                      ================================================= */}

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {message.message ||
                          "No message content."}
                      </p>


                      {/* =================================================
                          INTERVIEW BADGE
                      ================================================= */}

                      {hasInterview && (

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                            {interviewType === "ONLINE" ? (
                              <Video className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}

                            {interviewType === "ONLINE"
                              ? "Online Interview"
                              : "Offline Interview"}

                          </span>


                          {message.interviewDate && (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">

                              <CalendarDays className="h-3.5 w-3.5" />

                              {message.interviewDate}

                            </span>

                          )}


                          {message.interviewTime && (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">

                              <Clock className="h-3.5 w-3.5" />

                              {message.interviewTime}

                            </span>

                          )}

                        </div>

                      )}

                    </div>

                  </div>

                </button>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Messages;