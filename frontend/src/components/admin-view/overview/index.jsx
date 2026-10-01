import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStatsService } from "@/services";
import {
  BookOpen,
  DollarSign,
  GraduationCap,
  ShoppingCart,
  Users,
  UserSquare2,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    const response = await fetchAdminStatsService();
    if (response?.success) setStats(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const config = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      iconClass: "bg-[#ccc3d0]/30 text-primary",
    },
    {
      icon: GraduationCap,
      label: "Students",
      value: stats?.totalStudents ?? 0,
      iconClass: "bg-[#ccc3d0]/30 text-primary",
    },
    {
      icon: UserSquare2,
      label: "Instructors",
      value: stats?.totalInstructors ?? 0,
      iconClass: "bg-[#b2abb2]/30 text-[#6f636d]",
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats?.totalCourses ?? 0,
      iconClass: "bg-[#ebe7df] text-[#392f41]",
    },
    {
      icon: ShoppingCart,
      label: "Total Enrollments",
      value: stats?.totalEnrollments ?? 0,
      iconClass: "bg-[#95898e]/20 text-[#6f636d]",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats?.totalRevenue ?? 0}`,
      iconClass: "bg-[#392f41]/10 text-[#392f41]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {config.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <div className={`rounded-full p-2 ${item.iconClass}`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AdminOverview;
