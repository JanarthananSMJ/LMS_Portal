import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { useToast } from "@/hooks/use-toast";
import { useContext, useState } from "react";

// Images are stored inline as base64 data URIs in MongoDB (no external
// storage needed for a project like this) — keep raw files well under
// MongoDB's 16MB document limit, with room for base64's ~33% overhead
// and the rest of the course document.
const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

function CourseSettings() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  const [isEncoding, setIsEncoding] = useState(false);
  const { toast } = useToast();

  function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;

    if (selectedImage.size > MAX_IMAGE_SIZE_BYTES) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please choose an image under 3MB.",
      });
      event.target.value = "";
      return;
    }

    setIsEncoding(true);
    const reader = new FileReader();

    reader.onload = () => {
      setCourseLandingFormData({
        ...courseLandingFormData,
        image: reader.result,
      });
      setIsEncoding(false);
    };

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Could not read image",
        description: "Please try a different file.",
      });
      setIsEncoding(false);
    };

    reader.readAsDataURL(selectedImage);
  }

  function handleRemoveImage() {
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: "",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {courseLandingFormData?.image ? (
          <div className="space-y-3">
            <img
              src={courseLandingFormData.image}
              className="w-full max-w-md rounded-lg border object-cover"
            />
            <Button variant="outline" size="sm" onClick={handleRemoveImage}>
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              disabled={isEncoding}
            />
            {isEncoding ? (
              <p className="text-sm text-muted-foreground">Processing image...</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
