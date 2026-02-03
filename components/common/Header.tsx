export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">
          <a href="/">Git Training Ground</a>
        </h1>
        <nav>
          <a href="/">Home</a>
          <a href="/tutorial">Tutorial</a>
          <a href="https://github.com/keru-s/git-training-ground" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
