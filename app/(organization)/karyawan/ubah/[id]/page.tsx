import type { Metadata } from "next";
import EditEmployee from "@/components/views/Employee/EditEmployee";

export const metadata: Metadata = {
  title: "Ubah Karyawan",
};

export default async function UbahKaryawanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditEmployee id={id} />;
}
