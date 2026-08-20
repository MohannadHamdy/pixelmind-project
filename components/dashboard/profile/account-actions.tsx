import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAccountDialog } from "@/components/dashboard/profile/delete-account-dialog"

export function AccountActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteAccountDialog />
      </CardContent>
    </Card>
  )
}
