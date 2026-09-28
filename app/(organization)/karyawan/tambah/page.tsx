import type { Metadata } from "next";
import AddEmployee from "@/components/views/Employee/AddEmployee";

export const metadata: Metadata = {
  title: "Tambah Karyawan",
};

export default function TambahKaryawanPage() {
  return <AddEmployee />;
}
