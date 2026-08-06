export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          🚫 Access Denied
        </h1>

        <p className="text-gray-600 text-lg">
          You do not have permission to access this page.
        </p>

        <p className="text-sm text-gray-400 mt-3">
          Please login with an authorized account.
        </p>
      </div>
    </div>
  );
}