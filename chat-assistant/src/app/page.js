import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Chat System using LangChain and Hugging Face API
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
            A chatbot that provides detailed car specifications from a stored database.
          </p>
          <ol className="list-inside list-decimal text-base text-gray-700 dark:text-gray-200 mt-4 space-y-2">
            <li>Store detailed specifications of 20 cars in a database.</li>
            <li>Implement a chat system that retrieves car details from the stored data.</li>
            <li>Maintain chat history to ensure context-aware responses.</li>
          </ol>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/chat-client"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            GO
          </Link>
        </div>
      </main>
    </div>
  );
}
