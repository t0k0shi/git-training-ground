export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-gray-400 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p>© 2026 Git Training Ground. Licensed under MIT License.</p>
        <p className="mt-2">
          <a href="https://github.com/t0k0shi/git-training-ground" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          {' | '}
          <a href="/CODE_OF_CONDUCT.md" className="hover:text-white transition-colors">Code of Conduct</a>
        </p>
      </div>
    </footer>
  );
}
