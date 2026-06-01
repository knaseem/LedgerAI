import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import BgOrbs from '@/components/layout/BgOrbs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <BgOrbs />
      <Sidebar />
      <div className="ml-[260px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
