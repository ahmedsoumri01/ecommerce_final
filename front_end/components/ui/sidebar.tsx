"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1024;

      setIsMobile(mobile);

      if (mobile) {
        // Mobile: sidebar is hidden by default
        setIsOpen(false);
        setIsCollapsed(false);
      } else if (tablet) {
        // Tablet: sidebar is collapsed by default
        setIsOpen(true);
        setIsCollapsed(true);
      } else {
        // Desktop: sidebar is open by default
        setIsOpen(true);
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Determine if we should show text and full width
  const showFullContent = isMobile ? isOpen : isOpen && !isCollapsed;
  const sidebarWidth = showFullContent ? "w-64" : "w-16";

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-10 left-4 z-50 border-2 hover:bg-blue-500 hover:text-white md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          // Mobile behavior
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          // Desktop behavior
          !isMobile && "translate-x-0 md:static md:h-auto",
          // Width
          sidebarWidth,
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div
            className={cn(
              "flex items-center border-b transition-all duration-300",
              showFullContent ? "justify-between p-4" : "justify-center p-3"
            )}
          >
            {showFullContent && (
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                Menu
              </h2>
            )}

            {/* Desktop collapse button */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  showFullContent ? "" : "w-8 h-8 p-0"
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Navigation items */}
          <nav
            className={cn(
              "flex-1 transition-all duration-300",
              showFullContent ? "p-4" : "p-2"
            )}
          >
            <ul className="space-y-1">
              {items.map((item, index) => {
                const isActive = pathname === `/${locale}${item.href}`;

                return (
                  <li key={index}>
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={closeSidebar}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-gray-100 hover:text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600",
                        showFullContent
                          ? "px-3 py-2.5"
                          : "px-2 py-2.5 justify-center",
                        // Add tooltip positioning for collapsed state
                        !showFullContent && "group relative"
                      )}
                      title={!showFullContent ? item.title : undefined}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0 transition-all duration-200",
                          showFullContent ? "h-5 w-5 mr-3" : "h-5 w-5"
                        )}
                      />

                      {/* Text content - only show when expanded */}
                      {showFullContent && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full flex-shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip for collapsed state */}
                      {!showFullContent && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                          {item.title}
                          {item.badge && (
                            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer - optional branding or user info */}
          {showFullContent && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                TuniKado Admin
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Spacer for desktop layout */}
      {/* {!isMobile && (
        <div className={cn("transition-all duration-300", sidebarWidth)} />
      )} */}
    </>
  );
}
