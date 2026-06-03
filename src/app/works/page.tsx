import { ImmersiveWorksSection } from "@/components/works/ImmersiveWorksSection";

export const metadata = {
  title: "作品",
};

export default function WorksPage() {
  return (
    <div className="pt-16">
      <ImmersiveWorksSection />
    </div>
  );
}
