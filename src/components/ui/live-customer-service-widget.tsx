"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useAdminSettings } from "@/components/providers/admin-settings-provider";

const THREAD_KEY = "mian-tailor-live-support-thread-v1";

export function LiveCustomerServiceWidget() {
  const pathname = usePathname();
  const {
    hydrated,
    service,
    whatsapp,
    conversations,
    submitCustomerMessage,
  } = useAdminSettings();
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem(THREAD_KEY) ?? "",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const thread = useMemo(
    () => conversations.find((conversation) => conversation.id === threadId) ?? null,
    [conversations, threadId],
  );
  const whatsappHref = `https://wa.me/${whatsapp.number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    whatsapp.defaultMessage,
  )}`;

  useEffect(() => {
    if (threadId) {
      window.localStorage.setItem(THREAD_KEY, threadId);
      return;
    }

    window.localStorage.removeItem(THREAD_KEY);
  }, [threadId]);
  if (
    !hydrated ||
    pathname.startsWith("/admin") ||
    (!service.liveEnabled && !whatsapp.enabled)
  ) {
    return null;
  }

  function handleSendMessage() {
    const customerName = thread?.customerName ?? name;
    const customerEmail = thread?.customerEmail ?? email;

    if (!customerName.trim()) {
      setError("Enter your name.");
      return;
    }

    if (
      !customerEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      setError("Enter a valid email.");
      return;
    }

    if (text.trim().length < 4) {
      setError("Write a short message.");
      return;
    }

    const nextThreadId = submitCustomerMessage({
      conversationId: threadId || undefined,
      name: customerName,
      email: customerEmail,
      text,
    });

    if (nextThreadId) {
      setThreadId(nextThreadId);
      setText("");
      setError("");
      setOpen(true);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && service.liveEnabled ? (
        <div className="overflow-hidden border border-[rgba(46,16,101,0.14)] bg-[rgba(255,255,255,0.98)] shadow-[0_20px_60px_rgba(46,16,101,0.14)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(46,16,101,0.08)] bg-[rgba(124,58,237,0.08)] px-4 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Customer Service Live
              </p>
              <p className="mt-1 text-sm text-[var(--color-ivory)]">
                {service.assistantName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-[rgba(46,16,101,0.14)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ivory)]"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div className="space-y-1 text-sm leading-6 text-[rgba(46,16,101,0.68)]">
              <p className="text-[var(--color-ivory)]">{service.supportHeadline}</p>
              <p>{service.supportStatus}</p>
              <p>{service.responseTime}</p>
            </div>

            {thread ? (
              <div className="max-h-64 space-y-3 overflow-y-auto border border-[rgba(46,16,101,0.08)] bg-[rgba(124,58,237,0.03)] p-3">
                {thread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`space-y-1 border px-3 py-2 text-sm leading-6 ${
                      message.sender === "support"
                        ? "border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)]"
                        : "border-[rgba(46,16,101,0.1)] bg-[#ffffff]"
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold)]">
                      {message.sender === "support" ? "Support" : "You"}
                    </p>
                    <p className="whitespace-pre-line text-[rgba(46,16,101,0.72)]">
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {!thread ? (
              <div className="grid gap-3">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="field"
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  className="field"
                />
              </div>
            ) : (
              <div className="border border-[rgba(46,16,101,0.08)] px-3 py-2 text-sm leading-6 text-[rgba(46,16,101,0.62)]">
                {thread.customerName} · {thread.customerEmail}
              </div>
            )}

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write your message..."
              className="field min-h-28 resize-y"
            />

            {error ? (
              <p className="border border-[rgba(217,182,177,0.28)] bg-[rgba(217,182,177,0.08)] px-3 py-2 text-sm text-[#e8cac6]">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSendMessage}
              className="luxe-button w-full justify-center"
            >
              Send Message
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        {whatsapp.enabled ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label={whatsapp.buttonText}
            title={whatsapp.buttonText}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(37,211,102,0.35)] bg-[#25d366] text-white shadow-[0_14px_30px_rgba(37,211,102,0.28)] transition hover:scale-[1.03]"
          >
            <WhatsAppIcon />
          </a>
        ) : null}

        {service.liveEnabled ? (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close live customer service" : "Open live customer service"}
            title={open ? "Close live customer service" : "Open live customer service"}
            className={`flex h-14 w-14 items-center justify-center rounded-full border text-white shadow-[0_14px_30px_rgba(124,58,237,0.28)] transition hover:scale-[1.03] ${
              open
                ? "border-[rgba(124,58,237,0.45)] bg-[var(--color-ivory)]"
                : "border-[rgba(124,58,237,0.22)] bg-[var(--color-gold)]"
            }`}
          >
            <LiveSupportIcon active={open} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function LiveSupportIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-white" : "text-white"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
      <path d="M20 13v3a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
      <path d="M9 19c.7 1 1.8 1.5 3 1.5S14.3 20 15 19" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.1 4.9A9.84 9.84 0 0 0 12 2a9.92 9.92 0 0 0-8.6 14.9L2 22l5.3-1.4A10 10 0 0 0 12 21h0a9.99 9.99 0 0 0 7.1-17.1ZM12 19.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.16 8.16 0 1 1 12 19.2Zm4.5-6.1c-.2-.1-1.3-.7-1.5-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7 1-.1.1-.3.2-.5.1-1.5-.8-2.5-1.5-3.5-3.3-.1-.2 0-.4.1-.5l.3-.4c.1-.1.2-.3.3-.4.1-.1.1-.3 0-.4 0-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.3.9 2.4c.1.2 1.7 2.7 4.2 3.8.6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
