import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { BookOpen, Layers } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-[#392f41] via-[#6f636d] to-[#95898e] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 lg:flex-row lg:px-8 lg:py-24">
          <div className="lg:w-1/2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ccc3d0]">
              Learn without limits
            </p>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">
              Skills that move your career forward
            </h1>
            <p className="mb-8 max-w-md text-lg text-[#b2abb2]">
              Learn from real-world instructors with courses designed to help
              you master new skills, at your own pace.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/courses")}
              className="bg-[#ebe7df] text-[#392f41] hover:bg-[#ccc3d0]"
            >
              Explore Courses
            </Button>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/banner.png"
              alt="Students learning online"
              width={600}
              height={400}
              className="w-full h-auto rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Browse by category
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {courseCategories.map((categoryItem) => (
            <button
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card transition-all hover:border-primary hover:bg-accent hover:text-primary"
            >
              {categoryItem.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Featured courses
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <div
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="overflow-hidden">
                    <img
                      src={courseItem?.image}
                      width={300}
                      height={150}
                      className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-2 font-bold leading-snug text-foreground">
                      {courseItem?.title}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {courseItem?.instructorName}
                    </p>
                    <p className="text-lg font-extrabold text-foreground">
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="col-span-full text-center text-muted-foreground">
                No Courses Found
              </h1>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
