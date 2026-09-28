import type { Metadata } from "next";
import EditEmployeePicker from "@/components/views/Employee/EditEmployeePicker";

export const metadata: Metadata = {
  title: "Ubah Karyawan",
};

export default function UbahKaryawanPage() {
  return <EditEmployeePicker />;
}
