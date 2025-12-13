import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { TopBar } from "@/components/layout/TopBar";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { ActiveThreats } from "@/components/dashboard/ActiveThreats";
import { FederatedLearning } from "@/components/dashboard/FederatedLearning";
import { NetworkMetrics } from "@/components/dashboard/NetworkMetrics";
import { ThreatDetection } from "@/components/dashboard/ThreatDetection";
import { Performance } from "@/components/dashboard/Performance";
import { NetworkTopology } from "@/components/dashboard/NetworkTopology";
import { PacketAnalysis } from "@/components/dashboard/PacketAnalysis";
import { FLDashboard } from "@/components/dashboard/FLDashboard";
import { NotificationToast } from "@/components/ui/notification-toast";
import { DashboardData } from "@shared/schema";

export function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
    retryDelay: 1000,
  });

  const { data: realTimeData, isConnected } = useWebSocket("/api/ws");

  // Merge real-time data with dashboard data
  const data = realTimeData || dashboardData;

  if (error) {
    return (
      <div className="min-h-screen cyber-gradient flex items-center justify-center px-4">
        <div className="glass-panel-soft max-w-md w-full p-8 text-center space-y-4">
          <div className="text-red-400 text-lg font-semibold">Connection Error</div>
          <p className="cyber-text-muted text-sm">
            Failed to connect to backend services. Please check your network connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen cyber-gradient flex items-center justify-center px-4 relative overflow-hidden">
        <div className="cyber-grid-overlay" />
        <div className="glass-panel-soft max-w-md w-full p-8 text-center space-y-4">
          <div className="w-14 h-14 border-4 border-sky-500/70 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="cyber-text-primary text-lg font-medium">
            Initializing Cybersecurity Command Center...
          </p>
          <p className="cyber-text-muted text-xs">
            Establishing secure channels and synchronizing federated nodes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-gradient relative overflow-hidden">
      <div className="cyber-grid-overlay" />
      <TopBar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 hidden lg:block border-r border-border/60 px-4 py-6 min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 glass-panel-soft h-full p-4 overflow-y-auto">
            <SystemStatus data={data?.system} />
            <ActiveThreats threats={data?.threats?.activeThreats || []} />
            <FederatedLearning flData={data?.fl} />
          </div>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            <NetworkMetrics data={data?.network} />
            <ThreatDetection data={data?.threats} />
            <Performance data={data?.system} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <NetworkTopology />
            <PacketAnalysis packets={data?.network?.recentPackets || []} />
          </div>

          <FLDashboard flData={data?.fl} />
        </main>
      </div>

      <NotificationToast alerts={data?.recentAlerts || []} />
    </div>
  );
}
