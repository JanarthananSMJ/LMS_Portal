import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-primary p-6 text-white sm:p-10">
        <h1 className="mb-3 text-2xl font-extrabold sm:text-3xl">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="mb-4 text-lg text-slate-300">
          {studentViewCourseDetails?.subtitle}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {studentViewCourseDetails?.description}
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <li
                      key={index}
                      className={`${
                        curriculumItem?.freePreview
                          ? "cursor-pointer hover:bg-accent"
                          : "cursor-not-allowed opacity-60"
                      } flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      {curriculumItem?.freePreview ? (
                        <PlayCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                      ) : (
                        <Lock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      )}
                      <span className="text-foreground">{curriculumItem?.title}</span>
                      {curriculumItem?.freePreview ? (
                        <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-primary">
                          Preview
                        </span>
                      ) : null}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[420px]">
          <Card className="sticky top-20 overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-slate-900">
              <VideoPlayer
                url={
                  getIndexOfFreePreviewUrl !== -1
                    ? studentViewCourseDetails?.curriculum[
                        getIndexOfFreePreviewUrl
                      ].videoUrl
                    : ""
                }
                width="450px"
                height="200px"
              />
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-foreground">
                  ${studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button onClick={handleCreatePayment} size="lg" className="w-full">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-1">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-primary"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
