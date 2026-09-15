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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  deleteUserService,
  fetchAdminUsersService,
  updateUserRoleService,
} from "@/services";
import { Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const ROLE_OPTIONS = [
  { id: "user", label: "Student" },
  { id: "instructor", label: "Instructor" },
  { id: "admin", label: "Admin" },
];

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();

  async function fetchUsers() {
    const response = await fetchAdminUsersService();
    if (response?.success) setUsers(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleRoleChange(userId, role) {
    const response = await updateUserRoleService(userId, role);
    if (response?.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      );
      toast({
        variant: "success",
        title: "Role updated",
        description: `User is now ${role}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not update role",
        description: response?.message || "Please try again.",
      });
    }
  }

  async function handleDeleteUser(userId) {
    const response = await deleteUserService(userId);
    if (response?.success) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast({
        variant: "success",
        title: "User deleted",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not delete user",
        description: response?.message || "Please try again.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((userItem) => {
                  const isSelf = userItem._id === auth?.user?._id;

                  return (
                    <TableRow key={userItem._id}>
                      <TableCell className="font-medium">
                        {userItem.userName}
                        {isSelf ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (you)
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>{userItem.userEmail}</TableCell>
                      <TableCell>
                        <Select
                          value={userItem.role || "user"}
                          disabled={isSelf}
                          onValueChange={(value) =>
                            handleRoleChange(userItem._id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isSelf}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete this user?</DialogTitle>
                              <DialogDescription>
                                This will permanently remove{" "}
                                <span className="font-semibold">
                                  {userItem.userName}
                                </span>{" "}
                                ({userItem.userEmail}). This cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(userItem._id)}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No users found
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

export default AdminUsers;
