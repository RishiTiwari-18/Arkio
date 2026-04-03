import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useChat from "../hooks/useChat";
import { LogOut} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  const { handleNavigateToChat } = useChat();
  const { user } = useSelector((state: any) => state.auth);

  const { history } = useSelector((state: any) => state.chat);
  const displayName = user?.username || "User";
  const displayEmail = user?.email || ""
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="h-full flex flex-col w-60 p-1 bg-card border-r border-input">
      <div className="p-3 flex items-center mb-2 gap-2">
        <h1 className="text-xl font-semibold">Arkio.</h1>
      </div>
      <div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-md py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
        >
          <span className="px-3 block">+ New chat</span>
        </button>
      </div>
      <div className="py-4 flex-1">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground px-3">
          History
        </p>
        <div className="space-y-1">
          {history.map((item: { _id: string; title: string }) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleNavigateToChat(item._id)}
              className={`w-full rounded-md py-2 text-left text-sm transition ${
                item._id === chatId
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
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
            <div className="flex w-full px-3 items-center gap-3 rounded-lg py-2 text-left hover:bg-muted cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.profileImage} alt={displayName} />
                <AvatarFallback>{avatarLetter}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {displayEmail}
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
  );
}
