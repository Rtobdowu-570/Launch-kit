
"use client";
import { useState } from "react";

export function DomainSelector() {
  const [domain, setDomain] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Choose your domain</h2>
      <div className="mt-4 flex rounded-md shadow-sm">
        <input
          type="text"
          name="domain"
          id="domain"
          className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
          placeholder="your-brand"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
          .com
        </span>
      </div>
    </div>
  );
}
