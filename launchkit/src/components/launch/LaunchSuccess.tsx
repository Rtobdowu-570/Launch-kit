
"use client";

import Link from "next/link";

export function LaunchSuccess() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-gray-900">Congratulations!</h2>
      <p className="mt-4 text-lg text-gray-600">
        Your new brand and website are live.
      </p>
      <div className="mt-8">
        <Link
          href="/dashboard"
          className="px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          Go to your dashboard
        </Link>
      </div>
    </div>
  );
}
