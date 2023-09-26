import { Button } from "@/components/ui/button"
import Input from "@/components/input"

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-yellow-100">
      <div className="flex flex-col w-72 border-r border-yellow-200 bg-yellow-50">
        <div className="flex items-center h-16 px-6 border-b border-yellow-200 bg-yellow-50">
          <svg
            className=" h-6 w-6 text-yellow-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
            <path d="M15 3v6h6" />
          </svg>
          <h1 className="ml-2 text-lg font-semibold text-yellow-900">Notes</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 space-y-2">
            <Button className="justify-start text-yellow-900" variant="ghost">
              <svg
                className=" h-5 w-5 text-yellow-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
              <span className="ml-2">All Notes</span>
            </Button>
            <Button className="justify-start text-yellow-900" variant="ghost">
              <svg
                className=" h-5 w-5 text-yellow-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className="ml-2">Trash</span>
            </Button>
          </div>
          <div className="border-t border-yellow-200" />
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-yellow-200">
              <span className="text-sm text-yellow-900">Note 1</span>
              <svg
                className=" h-5 w-5 text-yellow-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-yellow-200">
              <span className="text-sm text-yellow-900">Note 2</span>
              <svg
                className=" h-5 w-5 text-yellow-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center h-16 px-6 border-b border-yellow-200 bg-yellow-50">
          <h2 className="text-lg font-semibold text-yellow-900">Note 1</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Input />
        </div>
      </div>
    </div>
  );
}
