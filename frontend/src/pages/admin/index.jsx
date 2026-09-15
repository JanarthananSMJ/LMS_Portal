import AdminOverview from "@/components/admin-view/overview";
import AdminUsers from "@/components/admin-view/users";
import AdminCourses from "@/components/admin-view/courses";
import AdminOrders from "@/components/admin-view/orders";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import {
  BarChart3,
  Book,
  LogOut,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useContext, useState } from "react";

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { auth, resetCredentials } = useContext(AuthContext);

  const menuItems = [
    {
      icon: BarChart3,
      label: "Overview",
      value: "overview",
      component: <AdminOverview />,
    },
    {
      icon: Users,
      label: "Users",
      value: "users",
      component: <AdminUsers />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <AdminCourses />,
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      value: "orders",
      component: <AdminOrders />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex h-full min-h-screen bg-secondary/50">
      <aside className="hidden w-64 border-r bg-card md:block">
        <div className="p-4">
          <div className="mb-6 flex items-center gap-2 px-2">
            <ShieldCheck className="h-6 w-6 text-violet-600" />
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                Admin Panel
              </h2>
              <p className="text-xs text-muted-foreground">
                {auth?.user?.userName}
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-foreground">
              {menuItems.find((item) => item.value === activeTab)?.label}
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
            {menuItems
              .filter((item) => item.value !== "logout")
              .map((menuItem) => (
                <Button
                  key={menuItem.value}
                  size="sm"
                  variant={activeTab === menuItem.value ? "default" : "outline"}
                  onClick={() => setActiveTab(menuItem.value)}
                  className="whitespace-nowrap"
                >
                  <menuItem.icon className="mr-2 h-4 w-4" />
                  {menuItem.label}
                </Button>
              ))}
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value} className="mt-0">
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
