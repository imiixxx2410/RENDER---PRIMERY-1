export function Footer() {
  return (
    <footer className="border-t border-surface-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-text-secondary md:flex-row">
        <span>© {new Date().getFullYear()} RenderSaaS. All rights reserved.</span>
        <div className="flex gap-6">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}
