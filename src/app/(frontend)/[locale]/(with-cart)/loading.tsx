export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-solid border-main-600 border-r-transparent"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
