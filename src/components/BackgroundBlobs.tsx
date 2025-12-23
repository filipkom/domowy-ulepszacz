export const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute inset-0 bg-background transition-colors duration-500" />
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob" />
    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000" />
    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-nibe-purple/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob-slow" />
  </div>
);
