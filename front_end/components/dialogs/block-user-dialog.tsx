"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserStore, type User } from "@/stores/user-store";

interface BlockUserDialogProps {
  user: User | null;
  action: "block" | "unblock";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockUserDialog({
  user,
  action,
  open,
  onOpenChange,
}: BlockUserDialogProps) {
  const { blockUser, isLoading } = useUserStore();

  const handleAction = async () => {
    if (!user) return;

    const newStatus = action === "block" ? "blocked" : "active";
    const success = await blockUser(user._id, newStatus);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "block" ? "Block User" : "Unblock User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} the user{" "}
            <span className="font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
            ?{" "}
            {action === "block"
              ? "They will no longer be able to access their account."
              : "They will regain access to their account."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={isLoading}
            className={
              action === "block"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : ""
            }
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {action === "block" ? "Blocking..." : "Unblocking..."}
              </>
            ) : action === "block" ? (
              "Block User"
            ) : (
              "Unblock User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
