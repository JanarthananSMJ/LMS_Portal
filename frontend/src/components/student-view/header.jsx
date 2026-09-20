import { GraduationCap, TvMinimalPlay, UserCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-8">
      <div className="flex items-center gap-6">
        <Link to="/home" className="flex items-center gap-2 text-foreground">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-lg font-extrabold tracking-tight md:text-xl">
            LMS<span className="text-primary">Learn</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            location.pathname.includes("/courses") ? null : navigate("/courses");
          }}
          className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          Explore Courses
        </Button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => navigate("/student-courses")}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:px-3"
        >
          <TvMinimalPlay className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">My Learning</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:px-3"
        >
          <UserCircle className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Profile</span>
        </button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
