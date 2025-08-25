import { SidebarProvider } from "./contexts/SidebarContext";
import Layout from "./components/layout/Layout";
import "./index.css";

function App() {
  return (
    <SidebarProvider>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Your Dashboard
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              This is your new application with a responsive sidebar. The
              sidebar can be:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
              <li>Collapsed/expanded on desktop</li>
              <li>Hidden/shown on mobile</li>
              <li>Automatically adapts to screen size</li>
            </ul>
          </div>
        </div>
      </Layout>
    </SidebarProvider>
  );
}

export default App;
