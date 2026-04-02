import { useSelector } from "react-redux";
import useChat from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Ellipsis,
  LogOut,
  Paperclip,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// const staticHistory = [
//   "Hey, make complete DBMS notes for unit 1",
//   "Summarize this Java chapter in easy language",
//   "Create a 7-day revision plan for RGPV exams",
//   "How to build auth flow in React + Redux?",
//   "Explain operating system deadlock with examples",
// ];

const staticChats = [
  {
    id: 1,
    role: "user" as const,
    message: "heyHey Rishi! What's up? Prepping for those RGPV exams, grinding in the gym, or coding something cool in React?Hey Rishi! What's up? Prepping for those RGPV exams, grinding in the gym, or coding something cool in React?Hey Rishi! What's up? Prepping for those RGPV exams, grinding in the gym, or coding something cool in React?",
  },
  {
    id: 2,
    role: "ai" as const,
    message:
      "Hey Rishi! What's up? Prepping for those RGPV exams, grinding in the gym, or coding something cool in React?",
  },
];

type ChatMessage = {
  id: number;
  role: "user" | "ai";
  message: string;
  image?: string;
};

export default function Dashboard() {
  const { initializeSocketClient } = useChat();
  const { user } = useSelector((state: any) => state.auth);
  const displayName = user?.username || user?.name || "Rishi Tiwari";
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "R";
  const [messages, setMessages] = useState<ChatMessage[]>(staticChats);
  const [prompt, setPrompt] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { history: chats } = useSelector((state: any) => state.chat);
  const { handleGetChats } = useChat();

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImage((event.target?.result as string) || null);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    const text = prompt.trim();
    if (!text && !pendingImage) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      message: text || "Image",
      image: pendingImage || undefined,
    };

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "ai",
      message: pendingImage
        ? "Nice image. I can analyze or describe it for you. You can now hook this with your backend vision pipeline."
        : "Great prompt. This is a dummy AI response for the static UI.",
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setPrompt("");
    setPendingImage(null);
  };


  useEffect(() => {
    handleGetChats();
  },[])

  useEffect(() => {
    initializeSocketClient();
  }, [initializeSocketClient]);

  return (
    <main className="h-screen w-screen flex">
      <aside className="h-full flex flex-col w-60 p-1 bg-card border-r border-input">
        <div className="p-3">
          <h1 className="text-xl font-semibold">Arkio.</h1>
        </div>
        <div className="py-8 flex-1">
          <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground px-3">
            History
          </p>
          <div className="space-y-1">
            {chats.map((item: { _id: string }) => (
              <button
                key={item._id}
                type="button"
                className="w-full rounded-md py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <span className="px-3 block overflow-hidden whitespace-nowrap mask-[linear-gradient(to_right,black_78%,transparent)]">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex w-full px-3 items-center gap-3 rounded-lg py-2 text-left hover:bg-muted">
                <Avatar>
                  <AvatarImage src={user?.profileImage} alt={displayName} />
                  <AvatarFallback>{avatarLetter}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Personal account
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="mb-1">
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <section className="w-full p-10">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
          <div className="flex-1 space-y-7 overflow-y-auto pb-6 pt-4">
            {messages.map((chat) => (
              <div
                key={chat.id}
                className={chat.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div className={chat.role === "user" ? "max-w-[78%]" : "max-w-full"}>
                  <div
                    className={
                      chat.role === "user"
                        ? "ml-auto w-fit rounded-2xl bg-muted px-4 py-2 text-sm text-foreground"
                        : "rounded-2xl px-1 py-1 text-3xl leading-relaxed text-foreground md:text-4xl"
                    }
                  >
                    {chat.role === "ai" ? <p className="text-lg md:text-3xl">{chat.message}</p> : chat.message}
                  </div>

                  {chat.image && (
                    <div className="mt-2 ml-auto w-fit overflow-hidden rounded-xl border border-input bg-background p-1">
                      <img src={chat.image} alt="Attached" className="max-h-40 rounded-lg object-cover" />
                    </div>
                  )}

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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a follow-up"
                className="max-h-32 min-h-10 w-full resize-none rounded-md border-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button onClick={handleSend} className="mb-1" size="icon-sm" aria-label="Send prompt">
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
