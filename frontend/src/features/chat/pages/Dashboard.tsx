import { useSelector } from "react-redux";
import useChat from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import {
  Copy,
  Ellipsis,
  Paperclip,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";


type ChatMessage = {
  _id: string;
  role: "user" | "ai";
  content: string;
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

  const [prompt, setPrompt] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        message: text || "Image",
        chatId,
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

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar/>

      <section className="min-h-0 w-full p-10 overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col">
          <div className="hide-scrollbar flex-1 space-y-7 overflow-y-auto pb-6 pt-4">
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
                <div className={chat.role === "user" ? "max-w-[78%]" : "max-w-full"}>
                  <div
                    className={
                      chat.role === "user"
                        ? "ml-auto w-fit rounded-2xl bg-muted px-4 py-2 text-sm text-foreground"
                        : "rounded-2xl px-1 py-1 text-sm leading-6 text-foreground md:text-base"
                    }
                  >
                    {chat.role === "ai" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 text-sm leading-6 text-foreground last:mb-0 md:text-base">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="mb-3 text-base font-semibold tracking-tight text-foreground md:text-lg">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground md:text-base">
                              {children}
                            </h2>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-3 ml-5 list-disc space-y-1 text-sm leading-6 text-foreground last:mb-0 md:text-base">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm leading-6 text-foreground last:mb-0 md:text-base">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="pl-1">{children}</li>,
                          code: ({ children, className }) =>
                            className ? (
                              <code className={className}>{children}</code>
                            ) : (
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
                                {children}
                              </code>
                            ),
                          pre: ({ children }) => (
                            <pre className="mb-3 overflow-x-auto rounded-xl bg-muted p-3 text-xs leading-5 text-foreground last:mb-0 md:text-sm">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {chat.content}
                      </ReactMarkdown>
                    ) : (
                      chat.content
                    )}
                  </div>

                  {chat.role === "ai" && (
                    <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                      <Button size="icon-sm" variant="ghost">
                        <Copy className="size-4" />
                      </Button>
                      <Button size="icon-sm" variant="ghost">
                        <ThumbsUp className="size-4" />
                      </Button>
                      <Button size="icon-sm" variant="ghost">
                        <ThumbsDown className="size-4" />
                      </Button>
                      <Button size="icon-sm" variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className={[
              "mt-auto w-full rounded-2xl border bg-card p-3 shadow-lg transition",
              isDragging ? "border-primary bg-accent/30" : "border-input",
            ].join(" ")}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processImageFile(file);
            }}
          >
            {pendingImage && (
              <div className="mb-3 relative inline-block overflow-hidden rounded-lg border border-input bg-background p-1">
                <img src={pendingImage} alt="Pending attachment" className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => setPendingImage(null)}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Attach image"
              >
                <Paperclip className="size-4" />
              </button>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a follow-up"
                className="max-h-32 min-h-10 w-full resize-none rounded-md border-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleSend}
                className="mb-1"
                size="icon-sm"
                aria-label="Send prompt"
                disabled={sending || (!prompt.trim() && !pendingImage)}
              >
                <SendHorizontal className="size-4" />
              </Button>
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

        </div>
      </section>
    </main>
  );
}
