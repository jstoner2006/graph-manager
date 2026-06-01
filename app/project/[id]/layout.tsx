import SideNav from "@/app/ui/project/sidenav";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { getProjectNameById } from "@/app/db/projects/actions";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Captures the dynamic [id] from the folder route
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
}) {
  const { id } = await params;

  const projectName = await getProjectNameById(id);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12 flex flex-col gap-6">
        <Breadcrumbs projectName={projectName} />

        <div className="grow">{children}</div>
      </div>
    </div>
  );
}
