"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useUserStore, useFilteredUsers, type User } from "@/stores/user-store";
import { EditUserModal } from "@/components/modals/edit-user-modal";
import { DeleteUserDialog } from "@/components/dialogs/delete-user-dialog";
import { BlockUserDialog } from "@/components/dialogs/block-user-dialog";

export default function UsersManagement({
  params,
}: {
  params: { locale: string };
}) {
  const {
    getAllUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    users,
  } = useUserStore();

  const filteredUsers = useFilteredUsers();

  // Modal/Dialog states
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [blockUser, setBlockUser] = useState<{
    user: User;
    action: "block" | "unblock";
  } | null>(null);

  // Load users on component mount
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.accountStatus === "active"
  ).length;
  const blockedUsers = users.filter(
    (user) => user.accountStatus === "blocked"
  ).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleDelete = (user: User) => {
    setDeleteUser(user);
  };

  const handleBlock = (user: User, action: "block" | "unblock") => {
    setBlockUser({ user, action });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="block my-1 md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Link className="my-1" href={`/${params.locale}/admin/users/create`}>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeUsers}
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {blockedUsers}
            </div>
            <p className="text-sm text-muted-foreground">Blocked Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{adminUsers}</div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter !== "all" ? "bg-transparent" : ""}
              >
                All Users
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
                className={statusFilter !== "active" ? "bg-transparent" : ""}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "blocked" ? "default" : "outline"}
                onClick={() => setStatusFilter("blocked")}
                className={statusFilter !== "blocked" ? "bg-transparent" : ""}
              >
                Blocked
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "outline"}
                onClick={() =>
                  setRoleFilter(roleFilter === "admin" ? "all" : "admin")
                }
                className={roleFilter !== "admin" ? "bg-transparent" : ""}
              >
                Admins
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto w-[300px] sm:w-[550px] md:w-[700px]   xl:w-[1000px] ">
            {/* Users Table */}
            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.accountStatus === "active"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                user.accountStatus === "active"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {user.accountStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="block gap-2">
                              <Button
                                onClick={() => handleEdit(user)}
                                className="cursor-pointer bg-orange-500 m-1.5"
                              >
                                <Edit className="h-4 w-4" /> update
                              </Button>
                              <Button
                                onClick={() =>
                                  handleBlock(
                                    user,
                                    user.accountStatus === "active"
                                      ? "block"
                                      : "unblock"
                                  )
                                }
                                className="cursor-pointer  m-1.5"
                              >
                                {user.accountStatus === "active" ? (
                                  <>
                                    <Ban className=" h-4 w-4" /> block
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4" /> activate
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleDelete(user)}
                                className="text-white bg-red-600 cursor-pointer  m-1.5 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" /> delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals - Rendered outside of dropdown to prevent conflicts */}
      {editUser && (
        <EditUserModal
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
        />
      )}

      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
        />
      )}

      {blockUser && (
        <BlockUserDialog
          user={blockUser.user}
          action={blockUser.action}
          open={!!blockUser}
          onOpenChange={(open) => !open && setBlockUser(null)}
        />
      )}
    </div>
  );
}
