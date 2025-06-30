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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage system users and their permissions
          </p>
        </div>
        <Link href={`/${params.locale}/admin/users/create`}>
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
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeUsers}
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {blockedUsers}
            </div>
            <p className="text-sm text-gray-600">Blocked Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{adminUsers}</div>
            <p className="text-sm text-gray-600">Admins</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
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
                        className="text-center py-8 text-gray-500"
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleBlock(
                                    user,
                                    user.accountStatus === "active"
                                      ? "block"
                                      : "unblock"
                                  )
                                }
                              >
                                {user.accountStatus === "active" ? (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Block User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Unblock User
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals and Dialogs */}
      <EditUserModal
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
      />

      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      />

      <BlockUserDialog
        user={blockUser?.user || null}
        action={blockUser?.action || "block"}
        open={!!blockUser}
        onOpenChange={(open) => !open && setBlockUser(null)}
      />
    </div>
  );
}
