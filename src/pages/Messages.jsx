import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [markingRead, setMarkingRead] =
    useState(false);
  const [replyText, setReplyText] =
    useState("");
  const [replySubmitting, setReplySubmitting] =
    useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeSubject, setComposeSubject] = useState("Professional introduction");
  const [composeSubmitting, setComposeSubmitting] = useState(false);
  const [composeError, setComposeError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const recipient = location.state?.recipient;


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

      const conversationResponse = await protectedRequest("/api/messages/conversations", { method: "GET" });
      const conversationData = await parseResponse(conversationResponse);
      setConversations(Array.isArray(conversationData) ? conversationData : []);

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

  async function openConversation(conversation) {
    if (!conversation?.conversationId) return;
    try {
      setThreadLoading(true);
      const data = await protectedRequest(`/api/messages/conversations/${encodeURIComponent(conversation.conversationId)}`, { method: "GET" });
      setSelectedConversation(conversation);
      setThread(Array.isArray(data) ? data : []);
      const unreadMessages = (Array.isArray(data) ? data : []).filter((message) =>
        !message.read && message.recipientEmail?.toLowerCase() === auth?.email?.toLowerCase()
      );
      await Promise.all(unreadMessages.map((message) => protectedRequest(`/api/messages/${message.id}/read`, { method: "PUT" }).catch(() => null)));
      setConversations((items) => items.map((item) => item.conversationId === conversation.conversationId ? { ...item, unreadCount: 0 } : item));
      window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    } catch (err) {
      setError(err?.message || "Unable to load conversation.");
    } finally {
      setThreadLoading(false);
    }
  }

  async function sendThreadReply() {
    if (!selectedConversation?.conversationId || !replyText.trim()) return;
    try {
      setReplySubmitting(true);
      const reply = await protectedRequest(`/api/messages/conversations/${encodeURIComponent(selectedConversation.conversationId)}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyText.trim() }),
      });
      setThread((items) => [...items, reply]);
      setReplyText("");
      await loadMessages();
    } catch (err) {
      setError(err?.message || "Unable to send reply.");
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleEditMessage(messageId) {
    if (!editingText.trim()) return;

    try {
      const updated = await protectedRequest(`/api/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ message: editingText.trim() }),
      });

      setThread((items) => items.map((item) => item.id === messageId ? { ...item, ...updated, message: updated.message || item.message, editedAt: updated.editedAt || item.editedAt } : item));
      setMessages((items) => items.map((item) => item.id === messageId ? { ...item, ...updated, message: updated.message || item.message, editedAt: updated.editedAt || item.editedAt } : item));
      setEditingMessageId(null);
      setEditingText("");
    } catch (err) {
      setError(err?.message || "Unable to edit message.");
    }
  }

  async function handleDeleteMessage(messageId) {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    try {
      const updated = await protectedRequest(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      setThread((items) => items.map((item) => item.id === messageId ? { ...item, ...updated, deleted: true, deletedAt: updated.deletedAt || new Date().toISOString() } : item));
      setMessages((items) => items.map((item) => item.id === messageId ? { ...item, ...updated, deleted: true, deletedAt: updated.deletedAt || new Date().toISOString() } : item));
      setConversations((items) => items.map((item) => item.conversationId === selectedConversation?.conversationId ? { ...item, latestMessage: "This message was deleted" } : item));
      setContextMenu(null);
      window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    } catch (err) {
      setError(err?.message || "Unable to delete message.");
    }
  }

  async function handleRestoreMessage(messageId) {
    try {
      const restored = await protectedRequest(`/api/messages/${messageId}/restore`, {
        method: "PUT",
      });

      setThread((items) => items.map((item) => item.id === messageId ? { ...item, ...restored, deleted: false, deletedAt: null } : item));
      setMessages((items) => items.map((item) => item.id === messageId ? { ...item, ...restored, deleted: false, deletedAt: null } : item));
      setContextMenu(null);
      window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    } catch (err) {
      setError(err?.message || "Unable to restore message.");
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
    setReplyText("");
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const menuFound = event.target instanceof Element && event.target.closest('[data-message-menu]');
      if (!menuFound) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function toggleSelection(messageId) {
    setSelectedMessageIds((previous) =>
      previous.includes(messageId)
        ? previous.filter((id) => id !== messageId)
        : [...previous, messageId]
    );
  }

  function startSelectionMode() {
    setSelectionMode(true);
    setHeaderMenuOpen(false);
  }

  function cancelSelection() {
    setSelectionMode(false);
    setSelectedMessageIds([]);
  }

  async function handleMarkConversationRead() {
    if (!selectedConversation?.conversationId || !thread.length) return;

    const unreadIds = thread
      .filter((item) => !item.read && item.recipientEmail?.toLowerCase() === auth?.email?.toLowerCase())
      .map((item) => item.id)
      .filter(Boolean);

    if (!unreadIds.length) return;

    await Promise.all(
      unreadIds.map((messageId) => protectedRequest(`/api/messages/${messageId}/read`, { method: 'PUT' }).catch(() => null))
    );

    setThread((items) => items.map((item) => (unreadIds.includes(item.id) ? { ...item, read: true } : item)));
    setConversations((items) => items.map((item) => item.conversationId === selectedConversation.conversationId ? { ...item, unreadCount: 0 } : item));
    window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    setHeaderMenuOpen(false);
  }

  async function handleBulkDelete() {
    if (!selectedMessageIds.length) return;

    const selected = selectedMessageIds.filter((id) => thread.some((item) => item.id === id));
    if (!selected.length) return;

    if (!window.confirm(`Delete ${selected.length} selected message(s)?`)) {
      return;
    }

    await Promise.all(
      selected.map((messageId) => protectedRequest(`/api/messages/${messageId}`, { method: 'DELETE' }).catch(() => null))
    );

    const nextThread = thread.filter((item) => !selected.includes(item.id));
    setThread(nextThread);
    setSelectedMessageIds([]);
    setSelectionMode(false);
    setHeaderMenuOpen(false);
    window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    await loadMessages();
  }

  async function handleBulkRestore() {
    if (!selectedMessageIds.length) return;

    const selected = selectedMessageIds.filter((id) => thread.some((item) => item.id === id && Boolean(item.deleted)));
    if (!selected.length) return;

    await Promise.all(
      selected.map((messageId) => protectedRequest(`/api/messages/${messageId}/restore`, { method: 'PUT' }).catch(() => null))
    );

    setThread((items) => items.map((item) => selected.includes(item.id) ? { ...item, deleted: false, deletedAt: null } : item));
    setSelectedMessageIds([]);
    setSelectionMode(false);
    setHeaderMenuOpen(false);
    window.dispatchEvent(new CustomEvent('onus:messages-updated'));
  }

  function handleMessageContextMenu(event, message) {
    event.preventDefault();
    event.stopPropagation();

    if (!message) return;

    const isOwnMessage = message.senderEmail?.toLowerCase() === auth?.email?.toLowerCase();
    if (!selectionMode && !isOwnMessage && !message.deleted) {
      return;
    }

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      messageId: message.id,
      isOwnMessage,
      deleted: Boolean(message.deleted),
    });
  }

  function handleLongPress(message) {
    if (!message) return;
    const isOwnMessage = message.senderEmail?.toLowerCase() === auth?.email?.toLowerCase();
    if (!selectionMode && !isOwnMessage && !message.deleted) {
      return;
    }

    setContextMenu({
      x: 24,
      y: 120,
      messageId: message.id,
      isOwnMessage,
      deleted: Boolean(message.deleted),
    });
  }

  async function handleReplySubmit() {
    if (!selectedMessage || !replyText.trim()) {
      return;
    }

    try {
      setReplySubmitting(true);
      const response = await protectedRequest(
        `/api/messages/${selectedMessage.id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({ message: replyText.trim() }),
        }
      );

      setReplyText("");
      setSelectedMessage((previous) => ({
        ...previous,
        replyAllowed: false,
      }));

      if (response && typeof response === "object") {
        setMessages((previousMessages) => [
          response,
          ...previousMessages,
        ]);
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
      setError(err?.message || "Unable to send reply.");
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleComposeSubmit() {
    if (!recipient?.id || !composeText.trim()) {
      return;
    }

    try {
      setComposeSubmitting(true);
      setComposeError("");
      await protectedRequest("/api/messages/direct", {
        method: "POST",
        body: JSON.stringify({
          recruiterId: recipient.id,
          subject: composeSubject.trim() || "Message from ONUS",
          message: composeText.trim(),
        }),
      });
      setComposeText("");
      navigate('/messages', { replace: true, state: null });
      await loadMessages();
      window.dispatchEvent(new CustomEvent('onus:messages-updated'));
    } catch (err) {
      setComposeError(err?.message || "Unable to send message.");
    } finally {
      setComposeSubmitting(false);
    }
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

  if (recipient && !selectedMessage) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <button type="button" onClick={() => navigate('/messages', { replace: true, state: null })} className="mb-5 text-sm font-medium text-gray-600 hover:text-blue-600">← Back to Messages</button>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{(recipient.name || "R").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div><h1 className="text-xl font-semibold text-gray-900">Message {recipient.name || "recruiter"}</h1><p className="text-sm text-gray-500">Send a professional message through ONUS.</p></div>
            </div>
            <input value={composeSubject} onChange={(event) => setComposeSubject(event.target.value)} placeholder="Subject" className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
            <textarea value={composeText} onChange={(event) => setComposeText(event.target.value)} placeholder="Write your message..." rows={7} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500" />
            {composeError && <p className="mt-3 text-sm text-red-600">{composeError}</p>}
            <div className="mt-4 flex justify-end"><button type="button" onClick={handleComposeSubmit} disabled={composeSubmitting || !composeText.trim()} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{composeSubmitting ? "Sending..." : "Send Message"}</button></div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedConversation && !selectedMessage) {
    const selectedThreadItems = thread.filter((item) => selectedMessageIds.includes(item.id));
    const unreadInThread = thread.filter((item) => !item.read && item.recipientEmail?.toLowerCase() === auth?.email?.toLowerCase()).length;

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <button type="button" onClick={() => setSelectedConversation(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Back to conversations</button>
          <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden border-r border-gray-100 bg-gray-50 p-4 lg:block"><h2 className="text-lg font-bold text-gray-900">Messages</h2><div className="mt-4 space-y-2">{conversations.map((conversation) => <button key={conversation.conversationId} type="button" onClick={() => openConversation(conversation)} className={`w-full rounded-xl p-3 text-left ${conversation.conversationId === selectedConversation.conversationId ? 'bg-blue-100' : 'hover:bg-white'}`}><p className="truncate text-sm font-semibold text-gray-800">{conversation.otherParticipant}</p><p className="mt-1 truncate text-xs text-gray-500">{conversation.latestMessage}</p></button>)}</div></aside>
            <section className="flex min-w-0 flex-col">
              <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white p-4 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-gray-900">{selectedConversation.otherParticipant}</p>
                  <p className="mt-1 text-sm text-gray-500">{selectedConversation.subject || 'Conversation'}</p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setHeaderMenuOpen((value) => !value)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                    aria-label="Conversation options"
                  >
                    <span className="text-lg leading-none">⋮</span>
                  </button>
                  {headerMenuOpen && (
                    <div className="absolute right-0 top-12 z-20 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      <button type="button" onClick={startSelectionMode} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Select messages</button>
                      {unreadInThread > 0 && (
                        <button type="button" onClick={handleMarkConversationRead} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Mark as read</button>
                      )}
                    </div>
                  )}
                </div>
              </header>

              {selectionMode && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-blue-50 px-4 py-3 text-sm text-slate-700">
                  <span className="font-medium text-blue-700">{selectedThreadItems.length} message{selectedThreadItems.length === 1 ? '' : 's'} selected</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedThreadItems.length === 1 && (
                      <button type="button" onClick={() => {
                        const item = thread.find((entry) => entry.id === selectedThreadItems[0].id);
                        if (!item) return;
                        if (item.senderEmail?.toLowerCase() !== auth?.email?.toLowerCase()) {
                          return;
                        }
                        setEditingMessageId(item.id);
                        setEditingText(item.message || '');
                        setSelectionMode(false);
                        setSelectedMessageIds([]);
                      }} className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:bg-slate-100">Edit</button>
                    )}
                    <button type="button" onClick={handleBulkDelete} className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:bg-slate-100">Delete</button>
                    <button type="button" onClick={handleBulkRestore} className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:bg-slate-100">Undo</button>
                    <button type="button" onClick={cancelSelection} className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-blue-700">Cancel</button>
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">{threadLoading ? <p className="text-sm text-slate-500">Loading conversation...</p> : thread.map((item) => { const mine = item.senderEmail?.toLowerCase() === auth?.email?.toLowerCase(); const deleted = Boolean(item.deleted); const isEditing = editingMessageId === item.id; const isSelected = selectedMessageIds.includes(item.id); return <div key={item.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className="relative max-w-[80%]" onContextMenu={(event) => handleMessageContextMenu(event, item)} onTouchStart={() => { const timer = window.setTimeout(() => handleLongPress(item), 550); return () => window.clearTimeout(timer); }} onTouchEnd={() => window.clearTimeout(window.__onusMessageTimer || 0)}>
                  {selectionMode && (
                    <label className="absolute -left-7 top-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelection(item.id)} className="hidden" />
                      {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                    </label>
                  )}
                  <div className={`rounded-2xl px-4 py-3 ${mine ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 shadow-sm'} ${isSelected ? 'ring-2 ring-blue-300' : ''}`}>
                    {deleted ? (
                      <div className="text-sm italic text-slate-400">This message was deleted</div>
                    ) : isEditing ? (
                      <div className="space-y-2">
                        <textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500" />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditMessage(item.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Save</button>
                          <button type="button" onClick={() => { setEditingMessageId(null); setEditingText(''); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-sm leading-6">{item.message}</p>
                        {Boolean(item.editedAt) && <p className={`mt-1 text-[10px] ${mine ? 'text-blue-100' : 'text-slate-400'}`}>(edited)</p>}
                      </>
                    )}
                  </div>
                  <div className={`mt-2 flex items-center justify-between gap-3 text-[11px] ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span>
                  </div>
                  {mine && !deleted && (
                    <div className="mt-1 text-right text-[10px] text-slate-600">{item.read ? '✓✓ Seen' : '✓ Sent'}</div>
                  )}
                </div>
              </div> })}</div>
              <div className="border-t border-gray-100 bg-white p-4"><div className="flex items-end gap-3"><textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Write a reply..." rows={2} className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" /><button type="button" onClick={sendThreadReply} disabled={replySubmitting || !replyText.trim()} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-300">{replySubmitting ? 'Sending...' : 'Send'}</button></div></div>
            </section>
          </div>
        </div>

        {contextMenu && (
          <div
            className="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            data-message-menu
          >
            <button type="button" onClick={() => { toggleSelection(contextMenu.messageId); setContextMenu(null); }} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Select</button>
            {contextMenu.isOwnMessage && !contextMenu.deleted && (
              <button type="button" onClick={() => {
                const item = thread.find((entry) => entry.id === contextMenu.messageId);
                if (!item) return;
                setEditingMessageId(item.id);
                setEditingText(item.message || '');
                setContextMenu(null);
              }} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Edit</button>
            )}
            <button type="button" onClick={() => { setContextMenu(null); handleDeleteMessage(contextMenu.messageId); }} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Delete</button>
            {contextMenu.deleted && (
              <button type="button" onClick={() => { setContextMenu(null); void handleRestoreMessage(contextMenu.messageId); }} className="block w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">Undo</button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!recipient && conversations.length > 0 && !selectedMessage) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8"><div className="mx-auto max-w-5xl"><div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Messages</h1><p className="mt-1 text-sm text-gray-500">Your conversations</p></div><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="divide-y divide-gray-100">{conversations.map((conversation) => <button key={conversation.conversationId} type="button" onClick={() => openConversation(conversation)} className="flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{(conversation.otherParticipant || 'U').slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate font-semibold text-slate-800">{conversation.otherParticipant}</p><span className="text-xs text-slate-400">{conversation.createdAt ? formatDate(conversation.createdAt) : ''}</span></div><p className="mt-1 truncate text-sm text-slate-500">{conversation.subject || 'Conversation'} · {conversation.latestMessage}</p></div>{conversation.unreadCount > 0 && <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{conversation.unreadCount}</span>}</button>)}</div></div></div></div>
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

              {selectedMessage.replyAllowed && (
                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <h2 className="text-base font-semibold text-gray-900">Reply</h2>
                  <textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="Write your reply to the recruiter..."
                    rows={5}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleReplySubmit}
                      disabled={replySubmitting || !replyText.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {replySubmitting ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}

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