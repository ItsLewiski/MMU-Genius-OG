import { LoginForm } from "@/components/auth/login-form"
import { PageLayout } from "@/components/layout/page-layout"

export default function LoginPage() {
  return (
    <PageLayout>
      <div className="container py-12 flex items-center justify-center">
        <LoginForm />
      </div>
    </PageLayout>
  )
}
