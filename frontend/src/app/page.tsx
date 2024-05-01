import AuthStatus from "../components/authStatus"
export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen pt-10 pb-6 px-2 md:px-0">
      <div className="max-w-md mx-auto px-4 bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Benvenuto su Serenade!</h1>
          <div className="flex justify-center">
            <AuthStatus />
          </div>
      </div>
    </main>
  );
}
