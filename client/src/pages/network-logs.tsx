import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/TopBar";
import { NetworkMetrics } from "@/components/dashboard/NetworkMetrics";
import { NetworkTopology } from "@/components/dashboard/NetworkTopology";
import { PacketAnalysis } from "@/components/dashboard/PacketAnalysis";
import { DashboardData } from "@shared/schema";

export function NetworkLogs() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  });

  if (error) {
    return (
      <div className="min-h-screen cyber-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Connection Error</div>
          <p className="text-gray-300">Failed to load network metrics</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen cyber-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="cyber-text-primary text-lg">Loading Network Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-gradient">
      <TopBar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold cyber-text-primary">Network Logs</h1>
        <p className="cyber-text-muted">
          Live network traffic metrics, topology, and recent packets from the intrusion detection system.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkMetrics data={data.network} />
          <NetworkTopology />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <PacketAnalysis packets={data.network?.recentPackets || []} />
        </div>
      </div>
    </div>
  );
}
