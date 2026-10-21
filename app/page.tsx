import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { HelixGallery } from "@/components/gallery/HelixGallery";
import { Publications } from "@/components/sections/Publications";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <ProofStrip />
        <Experience />
        <Projects />
        <HelixGallery />
        <Publications />
        <Skills />
      </main>
      <Contact />
    </>
  );
}
