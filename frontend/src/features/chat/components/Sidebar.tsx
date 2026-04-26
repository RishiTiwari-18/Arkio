import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useChat from "../hooks/useChat";
import { LogOut, Menu, X } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { resetChatState } from "../chats.slice";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chatId } = useParams<{ chatId: string }>();

  const { handleNavigateToChat } = useChat();
  const { handleLogout } = useAuth();
  const { user } = useSelector((state: any) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { history } = useSelector((state: any) => state.chat);
  const displayName = user?.username || "User";
  const displayEmail = user?.email || ""
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "U";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    try {
      await handleLogout();
    } finally {
      dispatch(resetChatState());
      closeMobileMenu();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-input md:bg-card/95 px-3 py-2 backdrop-blur md:hidden">
        <h1 className="text-xl font-semibold">Arkio.</h1>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="rounded-md p-2 text-foreground hover:bg-muted"
          aria-label={isMobileMenuOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeMobileMenu}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r border-input bg-card p-1 transition-transform md:static md:z-auto md:w-60",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center gap-2 p-3">
          <h1 className="text-xl font-semibold">Arkio.</h1>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              navigate("/");
            }}
            className="w-full rounded-md py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
          >
            <span className="block px-3">+ New chat</span>
          </button>
        </div>
        <div className="flex-1 py-4">
          <p className="mb-3 px-3 text-xs uppercase tracking-wide text-muted-foreground">
            History
          </p>
          <div className="max-h-[44dvh] space-y-1 overflow-y-auto pr-1 md:max-h-none">
            {history.map((item: { _id: string; title: string }) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  handleNavigateToChat(item._id);
                }}
                className={`w-full rounded-md py-2 text-left text-sm transition ${
                  item._id === chatId
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="block overflow-hidden whitespace-nowrap px-3 mask-[linear-gradient(to_right,black_78%,transparent)]">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted">
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
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
