import { auth } from "@clerk/nextjs/server"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await auth.protect()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  )
}
