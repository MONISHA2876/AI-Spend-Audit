import Header from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <h1 className="text-2xl font-bold">Home</h1>
        <p>Welcome to the Home page!</p>
      </main>
    </div>
  );
}
