import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Presentation } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SIGNUP_ROLES = [
  {
    id: "user",
    label: "Student",
    description: "Browse & learn courses",
    icon: GraduationCap,
  },
  {
    id: "instructor",
    label: "Instructor",
    description: "Create & sell courses",
    icon: Presentation,
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -32 : 32,
    opacity: 0,
  }),
};

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const directionRef = useRef(1);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    directionRef.current = value === "signup" ? 1 : -1;
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== "" &&
      signUpFormData.role !== ""
    );
  }

  async function onSignUpSubmit(event) {
    const signedUpEmail = signUpFormData.userEmail;
    const data = await handleRegisterUser(event);

    if (data?.success) {
      setSignInFormData((prev) => ({ ...prev, userEmail: signedUpEmail }));
      handleTabChange("signin");
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-[#392f41] via-[#6f636d] to-[#95898e] p-10 text-white lg:flex lg:w-1/2">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-extrabold tracking-tight">
            LMS<span className="text-[#ccc3d0]">Learn</span>
          </span>
        </Link>
        <div className="max-w-md">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight">
            Learn without limits
          </h1>
          <p className="text-lg text-[#b2abb2]">
            Start, switch, or advance your career with courses from real
            instructors — learn at your own pace, on any device.
          </p>
        </div>
        <p className="text-sm text-[#95898e]">
          © {new Date().getFullYear()} LMS Learn. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4 lg:hidden lg:px-6">
          <Link to="/" className="flex items-center justify-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-lg font-extrabold tracking-tight">
              LMS<span className="text-primary">Learn</span>
            </span>
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center bg-secondary/40 p-4">
          <Card className="w-full max-w-md overflow-hidden border shadow-card-hover">
            <CardContent className="pt-6">
              <Tabs
                value={activeTab}
                defaultValue="signin"
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>
                  {activeTab === "signin" ? (
                    <motion.div
                      key="signin"
                      custom={directionRef.current}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <CardHeader className="p-0 pb-4 text-center sm:text-left">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription>
                          Sign in to continue learning
                        </CardDescription>
                      </CardHeader>
                      <CommonForm
                        formControls={signInFormControls}
                        buttonText={"Sign In"}
                        formData={signInFormData}
                        setFormData={setSignInFormData}
                        isButtonDisabled={!checkIfSignInFormIsValid()}
                        handleSubmit={handleLoginUser}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      custom={directionRef.current}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <CardHeader className="p-0 pb-4 text-center sm:text-left">
                        <CardTitle className="text-2xl">
                          Create your account
                        </CardTitle>
                        <CardDescription>
                          Start learning something new today
                        </CardDescription>
                      </CardHeader>
                      <div className="mb-4">
                        <Label>I want to join as</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {SIGNUP_ROLES.map((roleOption) => {
                            const isActive = signUpFormData.role === roleOption.id;

                            return (
                              <button
                                key={roleOption.id}
                                type="button"
                                onClick={() =>
                                  setSignUpFormData((prev) => ({
                                    ...prev,
                                    role: roleOption.id,
                                  }))
                                }
                                className={cn(
                                  "flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-3 text-center transition-all",
                                  isActive
                                    ? "border-primary bg-accent"
                                    : "border-slate-300 hover:border-primary/50"
                                )}
                              >
                                <roleOption.icon
                                  className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-sm font-semibold",
                                    isActive ? "text-primary" : "text-foreground"
                                  )}
                                >
                                  {roleOption.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {roleOption.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <CommonForm
                        formControls={signUpFormControls}
                        buttonText={"Sign Up"}
                        formData={signUpFormData}
                        setFormData={setSignUpFormData}
                        isButtonDisabled={!checkIfSignUpFormIsValid()}
                        handleSubmit={onSignUpSubmit}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
