"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  items: Array<{
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
  locale: string;
  className?: string;
}

export function Sidebar({ items, locale, className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:h-auto",
          isOpen && !isMobile ? "w-64" : "w-16",
          isMobile && isOpen ? "w-64" : "",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            {(isOpen || isMobile) && (
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="hidden md:flex"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {items.map((item, index) => {
                const isActive = pathname === `/${locale}${item.href}`;
                return (
                  <li key={index}>
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={closeSidebar}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "hover:bg-gray-100 hover:text-gray-900",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600",
                        !isOpen && !isMobile ? "justify-center" : ""
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isOpen || isMobile ? "mr-3" : ""
                        )}
                      />
                      {(isOpen || isMobile) && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
