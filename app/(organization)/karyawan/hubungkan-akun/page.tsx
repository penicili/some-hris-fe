import type { Metadata } from "next";
import AssignUser from "@/components/views/Employee/AssignUser";

export const metadata: Metadata = {
  title: "Hubungkan Akun",
};

export default function HubungkanAkunPage() {
  return <AssignUser />;
}
