import { useState } from 'react';
import { TimeWidget } from '../components/widgets/TimeWidget';
import { DateWidget } from '../components/widgets/DateWidget';
import { AreaChartWidget } from '../components/widgets/AreaChartWidget';
import { DataTableWidget } from '../components/widgets/DataTableWidget';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  // Get user info from auth context
  const { user } = useAuth();

  // Shared ticker state for both chart and table widgets
  const [selectedTicker, setSelectedTicker] = useState('bitcoin');

  // Create personalized greeting
  const getGreeting = () => {
    if (user?.firstName && user?.lastName) {
      return `Welcome, ${user.firstName} ${user.lastName}`;
    }
    return 'Welcome to Hello AI Agent';
  };

  return (
    <div className="max-w-4xl w-full">
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            A modern React application with beautiful widgets and data
            visualization.
          </p>
        </div>

        {/* Existing widgets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TimeWidget />
          <DateWidget />
        </div>

        {/* Full-width chart widget */}
        <div className="mt-6 w-full">
          <AreaChartWidget
            defaultTicker={selectedTicker}
            onTickerChange={setSelectedTicker}
          />
        </div>

        {/* Data table widget */}
        <div className="mt-6 w-full">
          <DataTableWidget ticker={selectedTicker} />
        </div>
      </div>
    </div>
  );
}
