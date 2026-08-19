import { TopBar } from "@/components/dashboard/top-bar"

export default function DashboardPage() {
  return (
    <>
      <TopBar />
      <div className="flex-1 overflow-y-auto p-6">
        <h2>Main</h2>
      </div>
    </>
  )
}
