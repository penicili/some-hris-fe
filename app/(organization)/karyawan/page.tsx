import type { Metadata } from "next";
import EmployeeHub from "@/components/views/Employee/EmployeeHub";

export const metadata: Metadata = {
  title: "Karyawan",
};

export default function KaryawanPage() {
  return <EmployeeHub />;
}
