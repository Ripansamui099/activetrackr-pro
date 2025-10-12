import { 
  Users, FileCheck, BarChart3, MessageSquare, ShoppingCart, 
  Activity, Target, Dumbbell, UserCheck, Home 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  // Module 1: Admin Dashboard
  { title: "User Management", url: "/user-management", icon: Users, group: "Admin Dashboard" },
  { title: "Content Moderation", url: "/content-moderation", icon: FileCheck, group: "Admin Dashboard" },
  // Module 2: Analytics & Reports
  { title: "Report Generation", url: "/report-generation", icon: BarChart3, group: "Analytics & Reports" },
  { title: "Feedback Analysis", url: "/feedback-analysis", icon: MessageSquare, group: "Analytics & Reports" },
  // Module 3: E-commerce
  { title: "Product Management", url: "/product-management", icon: ShoppingCart, group: "E-commerce" },
  // Module 4: Activity Tracking
  { title: "Daily Activity", url: "/daily-activity", icon: Activity, group: "Activity Tracking" },
  { title: "Goal Tracking", url: "/goal-tracking", icon: Target, group: "Activity Tracking" },
  // Module 5: Workout & Trainer
  { title: "Workout Routine", url: "/workout-routine", icon: Dumbbell, group: "Workout & Trainer" },
  { title: "Trainer Assignment", url: "/trainer-assignment", icon: UserCheck, group: "Workout & Trainer" },
];

// Group items by module
const groupedItems = menuItems.reduce((acc, item) => {
  if (!item.group) {
    if (!acc["Main"]) acc["Main"] = [];
    acc["Main"].push(item);
  } else {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
  }
  return acc;
}, {} as Record<string, typeof menuItems>);

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        {Object.entries(groupedItems).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              {open && group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
