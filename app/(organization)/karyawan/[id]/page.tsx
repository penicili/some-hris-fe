import type { Metadata } from "next";
import EmployeeDetail from "@/components/views/Employee/EmployeeDetail";

export const metadata: Metadata = {
  title: "Detail Karyawan",
};

export default async function KaryawanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EmployeeDetail id={id} />;
}
