import type { Metadata } from "next";
import EmployeeList from "@/components/views/Employee/EmployeeList";

export const metadata: Metadata = {
  title: "Daftar Karyawan",
};

export default function DaftarKaryawanPage() {
  return <EmployeeList />;
}
