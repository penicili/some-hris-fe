import type { Metadata } from "next";
import MyEmployee from "@/components/views/Employee/MyEmployee";

export const metadata: Metadata = {
  title: "Data Saya",
};

export default function SayaPage() {
  return <MyEmployee />;
}
