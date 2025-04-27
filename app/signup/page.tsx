import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">AESTRIX</h1>
        <p className="text-gray-400">Your personal fitness companion</p>
      </div>
      <SignupForm />
    </div>
  )
}
