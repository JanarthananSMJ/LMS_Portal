import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
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
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <h1 className="mb-6 text-3xl font-extrabold text-foreground">
        All Courses
      </h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full space-y-1 md:w-64">
          {Object.keys(filterOptions).map((ketItem) => (
            <div key={ketItem} className="border-b border-border py-4 first:pt-0">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {ketItem}
              </h3>
              <div className="grid gap-3">
                {filterOptions[ketItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 font-normal text-foreground"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[ketItem] &&
                        filters[ketItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() =>
                        handleFilterOnChange(ketItem, option)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-5">
            <span className="text-sm font-semibold text-muted-foreground">
              {studentViewCoursesList.length}{" "}
              {studentViewCoursesList.length === 1 ? "Result" : "Results"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer transition-shadow hover:shadow-card-hover"
                  key={courseItem?._id}
                >
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                    <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-48">
                      <img
                        src={courseItem?.image}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="mb-2 text-xl text-foreground">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Created By{" "}
                        <span className="font-semibold text-foreground">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="mt-3 mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {courseItem?.curriculum?.length}{" "}
                          {courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"}
                        </span>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                          {courseItem?.level}
                        </span>
                      </p>
                      <p className="text-lg font-extrabold text-foreground">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <h1 className="text-2xl font-bold text-muted-foreground">
                No Courses Found
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
