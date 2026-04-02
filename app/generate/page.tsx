import GeneratorForm from "@/components/GeneratorForm";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Generate Content — ContentCraft",
  description: "Generate viral hooks, captions, hashtags, and scripts using AI.",
};

export default function GeneratePage() {
  return (
    <AppShell>
      <div className="pt-10 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: "#7C3AED", boxShadow: "0 0 8px #7C3AED80" }} />
              AI Generator
            </span>
            <h1 className="text-[28px] md:text-[40px] font-extrabold tracking-tight text-[#FAFAFA] mb-4">
              Create Content <span className="glow-text">10x Faster</span>
            </h1>
            <p className="text-[15px] text-[#6B7280] max-w-md mx-auto">
              Pick a platform, enter your topic, and let AI do the rest.
            </p>
          </div>

          <div className="bezel-outer">
            <div className="bezel-inner p-8 md:p-12">
              <GeneratorForm />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
