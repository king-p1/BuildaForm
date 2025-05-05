"use client";

export function FormsSkeletonLoader() {
  return (
    <div className="border rounded-lg p-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-32 animate-pulse mb-4"></div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}