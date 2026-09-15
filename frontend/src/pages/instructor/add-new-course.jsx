import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  const LANDING_FIELD_LABELS = {
    title: "Title",
    category: "Category",
    level: "Level",
    primaryLanguage: "Primary Language",
    subtitle: "Subtitle",
    description: "Description",
    pricing: "Pricing",
    objectives: "Objectives",
    welcomeMessage: "Welcome Message",
    image: "Course Image",
  };

  function getMissingRequirements() {
    const missing = [];

    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        missing.push(LANDING_FIELD_LABELS[key] || key);
      }
    }

    let hasFreePreview = false;
    let hasIncompleteLecture = false;

    courseCurriculumFormData.forEach((item) => {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
        hasIncompleteLecture = true;
      }
      if (item.freePreview) hasFreePreview = true;
    });

    if (hasIncompleteLecture) {
      missing.push("a title and uploaded video for every lecture");
    }
    if (!hasFreePreview) {
      missing.push("at least one lecture marked as Free Preview");
    }

    return missing;
  }

  const missingRequirements = getMissingRequirements();

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Create a new course
          </h1>
          {missingRequirements.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Before you can submit, add:{" "}
              <span className="text-destructive">
                {missingRequirements.join(", ")}
              </span>
            </p>
          ) : null}
        </div>
        <Button
          disabled={missingRequirements.length > 0}
          className="px-8 text-sm tracking-wider"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
