import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteAdminCourseService, fetchAdminCoursesService } from "@/services";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function fetchCourses() {
    const response = await fetchAdminCoursesService();
    if (response?.success) setCourses(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function handleDeleteCourse(courseId) {
    const response = await deleteAdminCourseService(courseId);
    if (response?.success) {
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast({
        variant: "success",
        title: "Course deleted",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not delete course",
        description: response?.message || "Please try again.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading courses...
                  </TableCell>
                </TableRow>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.instructorName}</TableCell>
                    <TableCell>{course.students?.length || 0}</TableCell>
                    <TableCell>
                      ${(course.students?.length || 0) * (course.pricing || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete this course?</DialogTitle>
                            <DialogDescription>
                              This will permanently remove{" "}
                              <span className="font-semibold">
                                {course.title}
                              </span>
                              . This cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteCourse(course._id)}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminCourses;
