import dynamic from 'next/dynamic'

const SignInForm = dynamic(() => import('@/components/auth/SignInForm'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  )
})

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <SignInForm />
      </div>
    </div>
  )
} 