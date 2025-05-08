import { RegisterForm } from "@/components/auth/register-form"
import { PageLayout } from "@/components/layout/page-layout"

export default function RegisterPage() {
  return (
    <PageLayout>
      <div className="container py-12 flex items-center justify-center">
        <RegisterForm />
      </div>
    </PageLayout>
  )
}
