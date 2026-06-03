import { ContactChannelGrid, ContactGreeting } from "@/components/ContactChannelGrid";

export const metadata = {
  title: "联系",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 pt-24">
      <ContactGreeting />
      <ContactChannelGrid />
    </div>
  );
}
