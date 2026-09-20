import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  changePasswordService,
  fetchProfileService,
  fetchStudentBoughtCoursesService,
  updateProfileService,
} from "@/services";
import { BookOpen, Mail, ShieldCheck, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function StudentProfilePage() {
  const { auth, updateAuthUser } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [boughtCourses, setBoughtCourses] = useState([]);

  async function loadProfile() {
    const response = await fetchProfileService();
    if (response?.success) {
      setProfile(response.data);
      setUserName(response.data.userName);
    }
    setLoading(false);
  }

  async function loadBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) setBoughtCourses(response.data);
  }

  useEffect(() => {
    loadProfile();
    loadBoughtCourses();
  }, []);

  async function handleSaveProfile(event) {
    event.preventDefault();

    if (!userName.trim()) {
      toast({
        variant: "destructive",
        title: "User name required",
        description: "Please enter a user name.",
      });
      return;
    }

    try {
      setSavingProfile(true);
      const response = await updateProfileService({ userName: userName.trim() });

      if (response?.success) {
        setProfile(response.data);
        updateAuthUser({ userName: response.data.userName });
        toast({
          variant: "success",
          title: "Profile updated",
          description: "Your changes have been saved.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
      });
      return;
    }

    try {
      setChangingPassword(true);
      const response = await changePasswordService({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response?.success) {
        toast({
          variant: "success",
          title: "Password changed",
          description: "Use your new password next time you sign in.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Change failed",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Change failed",
        description: error?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) return <Skeleton className="m-8 h-96" />;

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {getInitials(profile?.userName)}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            {profile?.userName}
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.userEmail}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-semibold capitalize text-foreground">
                {profile?.role === "user" ? "Student" : profile?.role}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Enrolled courses</p>
              <p className="text-sm font-semibold text-foreground">
                {boughtCourses.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="text-sm font-semibold text-foreground">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Account details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="courses">My courses</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="userName">User name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="userEmail">Email</Label>
                  <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profile?.userEmail}
                  </div>
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleChangePassword}
                className="max-w-md space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? "Updating..." : "Update password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My courses</CardTitle>
            </CardHeader>
            <CardContent>
              {boughtCourses.length > 0 ? (
                <ul className="divide-y divide-border">
                  {boughtCourses.map((course) => (
                    <li
                      key={course.courseId}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={course?.courseImage}
                          alt={course?.title}
                          className="h-12 w-16 flex-shrink-0 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {course?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {course?.instructorName}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/course-progress/${course?.courseId}`)
                        }
                      >
                        Continue
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You haven't purchased any courses yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudentProfilePage;
