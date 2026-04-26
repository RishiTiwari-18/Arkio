import React, { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import PromptComposer from "../components/PromptComposer";

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
        image: pendingImage || undefined,
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
    <main className="flex h-dvh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <Sidebar />

      <section className="flex min-h-0 flex-1 w-full overflow-hidden p-4 sm:p-6 md:p-10">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
          <div className="flex flex-1 items-center justify-center text-center">
            <h1 className="mb-2 text-2xl leading-tight sm:text-2xl lg:text-3xl">What's on your mind today?</h1>
          </div>

          <div className="mt-auto w-full max-w-2xl px-0 pb-2 sm:px-2 sm:pb-0 md:px-4">
            <PromptComposer
              value={prompt}
              onChange={setPrompt}
              onSend={handleSend}
              onAttachClick={() => fileInputRef.current?.click()}
              onRemoveAttachment={() => setPendingImage(null)}
              attachmentPreview={pendingImage}
              placeholder="Ask me anything or share an image..."
              disabled={loading}
              sending={loading}
              maxHeight={180}
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
