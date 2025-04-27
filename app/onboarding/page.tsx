
import { OnboardingForm } from "@/components/auth/onboarding-form"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to AESTRIX</h1>
        <p className="text-gray-400">Let's set up your profile</p>
      </div>
      <OnboardingForm />
    </div>
  )
}
