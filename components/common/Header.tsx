export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#1E293B]">
          <a href="/">Git Training Ground</a>
        </h1>
        <nav className="flex gap-6 text-sm font-medium text-[#64748B]">
          <a href="/" className="hover:text-[#2563EB] transition-colors">Home</a>
          <a href="/tutorial" className="hover:text-[#2563EB] transition-colors">Tutorial</a>
          <a href="https://github.com/t0k0shi/git-training-ground" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
