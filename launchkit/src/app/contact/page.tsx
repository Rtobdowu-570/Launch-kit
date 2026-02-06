
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coming Soon
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Support</h1>
          <p className="text-xl text-gray-600 mb-8">
            Get in touch with the LaunchKit team.
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Support System Coming Soon
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We're building a comprehensive support system to help you with any questions or issues. 
              In the meantime, you can reach us through your dashboard.
            </p>
            <div className="inline-flex items-center gap-2 text-purple-600 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check your dashboard for current support options
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
