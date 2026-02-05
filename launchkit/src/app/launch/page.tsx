
import { LaunchFlow } from "@/components/launch/LaunchFlow";

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
        <LaunchFlow />
      </div>
    </div>
  );
}
