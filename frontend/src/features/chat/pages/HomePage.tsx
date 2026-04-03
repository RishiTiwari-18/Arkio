import React, { useEffect, useState } from "react";
import { SendHorizontal, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useChat from "../hooks/useChat";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const { handleSendMessage, handleGetChats } = useChat();
  const [prompt, setPrompt] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

    setLoading(true);
    try {
      await handleSendMessage({
        message: text || "Image",
        chatId: undefined,
      });
      setPrompt("");
      setPendingImage(null);
      // Navigate to the chat after creating it
      // The handleSendMessage should trigger route navigation via socket/redux
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetChats();
  }, []);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar />

      <section className="min-h-0 w-full overflow-hidden p-10">
        <div className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col items-center justify-center">
          <div className="mb-16 text-center">
            <h1 className="mb-2 text-xl  leading-tight sm:text-2xl lg:text-3xl ">What's on your mind today?</h1>
          </div>

          <div className="w-full max-w-2xl px-4">
            <div className="rounded-xl border border-input bg-card p-4 shadow-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything or share an image..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="icon"
                className="h-auto p-2"
              >
                <Paperclip className="size-4" />
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading || (!prompt.trim() && !pendingImage)}
                className="h-auto rounded-lg"
              >
                <SendHorizontal className="size-4" />
              </Button>
            </div>

            {pendingImage && (
              <div className="mt-3 relative inline-block overflow-hidden rounded-lg border border-input bg-background p-1">
                <img
                  src={pendingImage}
                  alt="Pending attachment"
                  className="h-16 w-16 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPendingImage(null)}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

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

            {/* <div className="mt-8 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground text-center">
                Try these
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Make DBMS notes",
                  "Summarize a chapter",
                  "Revision plan",
                  "Explain a concept",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(suggestion)}
                    className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
