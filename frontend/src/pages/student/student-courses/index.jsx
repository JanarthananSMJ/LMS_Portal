import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <h1 className="mb-8 text-3xl font-extrabold text-foreground">
        My Courses
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <img
                src={course?.courseImage}
                alt={course?.title}
                className="h-40 w-full object-cover"
              />
              <CardContent className="flex-grow p-4">
                <h3 className="mb-1 line-clamp-2 font-bold leading-snug text-foreground">
                  {course?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="col-span-full text-xl font-semibold text-muted-foreground">
            You haven't purchased any courses yet.
          </h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
