import { useSelector } from "react-redux";
import useChat from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import {
  Check,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "../components/Sidebar";
import PromptComposer from "../components/PromptComposer";


type ChatMessage = {
  _id: string;
  role: "user" | "ai";
  content: string;
  image?: string;
};

const getCodeText = (node: any): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getCodeText).join("");
  if (node?.props?.children) return getCodeText(node.props.children);
  return "";
};

const getLanguage = (className?: string) => {
  if (!className) return "code";
  const match = className.match(/language-([\w-]+)/);
  return match?.[1] || "code";
};

export default function Dashboard() {
  const { chatId } = useParams<{ chatId: string }>();

  const {
    initializeSocketClient,
    handleGetChats,
    handleGetMessage,
    handleSendMessage,
  } = useChat();

  const { chats: chatMap, loading } = useSelector(
    (state: any) => state.chat,
  );


  const messages: ChatMessage[] = chatId ? chatMap?.[chatId]?.messages || [] : [];
  const hasPendingAiBubble = messages.some(
    (msg) => msg.role === "ai" && !(msg.content || "").trim(),
  );

  const [prompt, setPrompt] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const lastMessageContent = messages[messages.length - 1]?.content || "";
  const shouldShowWaitingSkeleton = sending && !hasPendingAiBubble;

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedCode(null);
      }, 1800);
    } catch {
      setCopiedCode(null);
    }
  };

  const handleCopyMessage = async (message: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(messageId);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 1800);
    } catch {
      setCopiedMessageId(null);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImage((event.target?.result as string) || null);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text && !pendingImage) return;

    try {
      setSending(true);
      await handleSendMessage({
        message: text,
        chatId,
        image: pendingImage || undefined,
      });
      setPrompt("");
      setPendingImage(null);
    } finally {
      setSending(false);
    }
  };


  useEffect(() => {
    handleGetChats();
  },[])

  useEffect(() => {
    if (chatId) {
      handleGetMessage(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    initializeSocketClient();
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = chatScrollRef.current;
    if (!container) return;

    // Keep the newest streamed tokens in view.
    container.scrollTop = container.scrollHeight;
  }, [chatId, messages.length, lastMessageContent]);

  const markdownComponents: any = {
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-sm leading-7 text-foreground/90 last:mb-0 md:text-[15px]">
        {children}
      </p>
    ),
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground md:text-xl">
        {children}
      </h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="mb-2 text-base font-semibold tracking-tight text-foreground md:text-lg">
        {children}
      </h4>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="mb-4 ml-5 list-disc space-y-2 text-sm leading-7 text-foreground/90 md:text-[15px]">
        {children}
      </ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="mb-4 ml-5 list-decimal space-y-2 text-sm leading-7 text-foreground/90 md:text-[15px]">
        {children}
      </ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="mb-4 border-l-4 border-primary/50 bg-muted/40 px-4 py-3 text-sm italic text-foreground/85 md:text-[15px]">
        {children}
      </blockquote>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    a: ({ children, href }: { children: React.ReactNode; href?: string }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary underline underline-offset-4 decoration-primary/40 transition hover:decoration-primary"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-5 border-border/80" />,
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="mb-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-foreground/90">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: { children: React.ReactNode }) => (
      <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
        {children}
      </thead>
    ),
    tbody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    tr: ({ children }: { children: React.ReactNode }) => (
      <tr className="border-b border-border last:border-0">{children}</tr>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="px-4 py-3 font-semibold text-foreground">{children}</th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="px-4 py-3 align-top">{children}</td>
    ),
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <img
        src={src}
        alt={alt || "Embedded image"}
        className="my-4 max-w-full rounded-2xl border border-border shadow-sm"
      />
    ),
    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
      const isBlock = Boolean(className);

      if (isBlock) {
        return <code className={className}>{children}</code>;
      }

      return (
        <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
          {children}
        </code>
      );
    },
    pre: ({ children }: { children: React.ReactNode }) => {
      const codeElement = Array.isArray(children) ? children[0] : children;
      const codeText = getCodeText(codeElement).replace(/\n$/, "");
      const className = codeElement && typeof codeElement === "object" ? codeElement.props?.className : undefined;
      const language = getLanguage(className);
      const isCopied = copiedCode === codeText;

      return (
        <div className="group my-5 overflow-hidden rounded-xl border border-[#3c3c3c] bg-[#1e1e1e] text-[#d4d4d4] shadow-lg">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#252526] px-4 py-2.5 text-xs text-[#9da1a6]">
            <span className="font-medium uppercase tracking-[0.18em] text-[#9da1a6]">
              {language}
            </span>
            <button
              type="button"
              onClick={() => handleCopyCode(codeText)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#d4d4d4] transition hover:bg-white/10 hover:text-white"
            >
              {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[#d4d4d4] md:text-[13px]">
            <code className="font-mono">{codeText}</code>
          </pre>
        </div>
      );
    },
  };

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <Sidebar/>

      <section className="flex min-h-0 flex-1 w-full overflow-hidden p-3 sm:p-5 md:p-10">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-1 flex-col">
          <div ref={chatScrollRef} className="hide-scrollbar flex-1 space-y-5 overflow-y-auto pb-4 pt-2 sm:space-y-7 sm:pb-6 sm:pt-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-dashed border-input bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                {loading
                  ? "Loading chat messages..."
                  : "Start by asking a question to get your first AI response."}
              </div>
            )}
            {messages.map((chat) => (
              <div
                key={chat._id}
                className={chat.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div className={chat.role === "user" ? "max-w-[88%] sm:max-w-[78%]" : "max-w-full"}>
                  <div
                    className={
                      chat.role === "user"
                        ? "ml-auto w-fit rounded-2xl bg-muted px-3 py-2 text-sm text-foreground sm:px-4"
                        : "rounded-2xl px-1 py-1 text-sm leading-6 text-foreground md:text-base"
                    }
                  >
                    {chat.role === "ai" ? (
                      !(chat.content || "").trim() ? (
                        null
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {chat.content}
                        </ReactMarkdown>
                      )
                    ) : (
                      chat.content
                    )}
                  </div>

                  {chat.image && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-input bg-background p-1">
                      <img
                        src={chat.image}
                        alt="Uploaded by user"
                        className="max-h-72 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {chat.role === "ai" && (chat.content || "").trim() && (
                    <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopyMessage(chat.content, chat._id)}
                        aria-label="Copy AI response"
                      >
                        {copiedMessageId === chat._id ? (
                          <Check className="size-4" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {shouldShowWaitingSkeleton && (
              <div className="flex justify-start">
                <div className="w-full max-w-xl flex flex-col gap-2 rounded-2xl px-1 py-1">
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-8/12" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto w-full pb-2 sm:pb-0">
            <PromptComposer
              value={prompt}
              onChange={setPrompt}
              onSend={handleSend}
              onAttachClick={() => fileInputRef.current?.click()}
              onAttachmentDrop={processImageFile}
              onRemoveAttachment={() => setPendingImage(null)}
              attachmentPreview={pendingImage}
              placeholder="Ask a follow-up"
              disabled={sending}
              sending={sending}
              maxHeight={200}
              className="border border-input bg-card shadow-lg"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processImageFile(file);
                e.currentTarget.value = "";
              }}
            />
          </div>

        </div>
      </section>
    </main>
  );
}
