import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrations | Jauhr E Teg Tournament Admin",
  description: "Manage and review all tournament registrations",
};

export default function RegistrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
