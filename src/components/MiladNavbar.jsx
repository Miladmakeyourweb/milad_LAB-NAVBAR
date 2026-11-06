
import { useEffect, useRef, useState } from "react";

const CHANNEL_URL = "https://www.youtube.com/channel/UCNhlqhCGuu0ZPySp7Ygmg5w";

const LINKS = [
  { label: "Home", href: "#home", type: "Navigation" },
  { label: "Experiments", href: "#experiments", type: "Navigation" },
  { label: "Videos", href: "#videos", type: "Navigation" },
  { label: "About", href: "#about", type: "Navigation" },
];

const TOOLS = [
  {
    title: "AI Playground",
    description: "Explore AI experiments",
    href: "#ai-playground",
    icon: "sparkles",
  },
  {
    title: "Prompt Library",
    description: "Prompts worth saving",
    href: "#prompts",
    icon: "terminal",
  },
  {
    title: "Creator Toolkit",
    description: "Tools for creators",
    href: "#creator-tools",
    icon: "layers",
  },
  {
    title: "Latest Drops",
    description: "Discover new projects",
    href: "#latest",
    icon: "zap",
  },
];

function Icon({ name, size = 18, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    play: <path d="m9 6 10 6-10 6V6Z" />,
    sparkles: (
      <>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
      </>
    ),
    terminal: (
      <>
        <path d="m4 7 5 5-5 5" />
        <path d="M12 17h8" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    zap: <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z" />,
    command: (
      <>
        <path d="M9 9V5.5A2.5 2.5 0 1 0 6.5 8H9v8H6.5A2.5 2.5 0 1 0 9 18.5V16h6v2.5a2.5 2.5 0 1 0 2.5-2.5H15V8h2.5A2.5 2.5 0 1 0 15 5.5V8H9Z" />
      </>
    ),
    corner: <path d="M7 7h10v10" />,
  };

  return <svg {...common}>{paths[name] || paths.sparkles}</svg>;
}

function BrandMark() {
  return (
    <span className="milad-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M6 23V9l10 9 10-9v14"
          stroke="var(--milad-text)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          className="milad-mark-orbit"
          cx="16"
          cy="16"
          r="13"
          stroke="var(--milad-accent)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        <circle cx="26" cy="8" r="2" fill="var(--milad-accent)" />
      </svg>
    </span>
  );
}

function ToolCard({ tool }) {
  return (
    <a className="milad-tool" href={tool.href}>
      <span className="milad-tool-icon">
        <Icon name={tool.icon} size={18} />
      </span>
      <span>
        <span className="milad-tool-title">{tool.title}</span>
        <span className="milad-tool-desc">{tool.description}</span>
      </span>
    </a>
  );
}

export default function MiladNavbar() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("milad-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const toolsRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.miladTheme = theme;

    try {
      localStorage.setItem("milad-theme", theme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => cancelAnimationFrame(frame);
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut = (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
        setToolsOpen(false);
        setMobileOpen(false);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setToolsOpen(false);
        setMobileOpen(false);
        setMobileToolsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target)
      ) {
        setToolsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handlePointerMove = (event) => {
      const rect = header.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      header.style.setProperty("--mx", `${x}%`);
      header.style.setProperty("--my", `${y}%`);
    };

    header.addEventListener("pointermove", handlePointerMove);

    return () =>
      header.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const results = [...LINKS, ...TOOLS.map((tool) => ({
    label: tool.title,
    href: tool.href,
    type: "AI Tool",
  }))].filter((item) =>
    `${item.label} ${item.type}`.toLowerCase().includes(normalizedQuery)
  );

  const closeMenus = () => {
    setSearchOpen(false);
    setToolsOpen(false);
    setMobileOpen(false);
    setMobileToolsOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Experiments", href: "#experiments" },
    { label: "Videos", href: "#videos" },
    { label: "About", href: "#about" },
  ];

  return (
    <header
      ref={headerRef}
      className={`milad-header ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="milad-shell">
        <nav className="milad-nav" aria-label="Main navigation">
          <a
            href="#home"
            className="milad-brand"
            onClick={closeMenus}
            aria-label="MILAD home"
          >
            <BrandMark />
            <span>
              <span className="milad-brand-name">MILAD</span>
              <span className="milad-brand-sub">NEXUS / 01</span>
            </span>
          </a>

          <div className="milad-nav-links">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                className={`milad-link ${link.label === "Home" ? "active" : ""}`}
                href={link.href}
              >
                {link.label}
              </a>
            ))}

            <div className="milad-dropdown-wrap" ref={toolsRef}>
              <button
                type="button"
                className={`milad-link ${toolsOpen ? "active" : ""}`}
                aria-expanded={toolsOpen}
                onClick={() => {
                  setToolsOpen((value) => !value);
                  setSearchOpen(false);
                }}
              >
                AI Tools
                <Icon name="chevron" size={14} />
              </button>

              {toolsOpen && (
                <div className="milad-dropdown">
                  <div className="milad-dropdown-head">
                    <span className="milad-eyebrow">
                      <span className="milad-live-dot" />
                      MILAD AI LAB
                    </span>
                    <span className="milad-eyebrow">EXPLORE / 04</span>
                  </div>
                  <div className="milad-tool-grid">
                    {TOOLS.map((tool) => (
                      <ToolCard key={tool.title} tool={tool} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <a key={link.label} className="milad-link" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="milad-actions">
            <div className="milad-search" ref={searchRef}>
              <button
                type="button"
                className="milad-icon-btn"
                aria-label="Open search"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen((value) => !value);
                  setToolsOpen(false);
                }}
              >
                <Icon name="search" size={18} />
              </button>

              {searchOpen && (
                <div className="milad-search-panel">
                  <div className="milad-search-input-wrap">
                    <Icon name="search" size={17} />
                    <input
                      ref={inputRef}
                      className="milad-search-input"
                      placeholder="Search the universe..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      aria-label="Search navigation and AI tools"
                    />
                    <span className="milad-shortcut">ESC</span>
                  </div>

                  <div className="milad-search-caption">
                    <span>QUICK ACCESS</span>
                    <span>{results.length} RESULTS</span>
                  </div>

                  {results.length ? (
                    results.map((result, index) => (
                      <a
                        key={`${result.type}-${result.label}`}
                        className="milad-result"
                        href={result.href}
                        style={{ animationDelay: `${index * 35}ms` }}
                        onClick={closeMenus}
                      >
                        <span className="milad-result-icon">
                          <Icon
                            name={result.type === "AI Tool" ? "sparkles" : "corner"}
                            size={16}
                          />
                        </span>
                        <span style={{ flex: 1 }}>
                          <span className="milad-result-name">
                            {result.label}
                          </span>
                          <span className="milad-result-type">
                            {result.type}
                          </span>
                        </span>
                        <Icon name="arrow" size={14} />
                      </a>
                    ))
                  ) : (
                    <div className="milad-empty">
                      No matching destinations found.
                    </div>
                  )}

                  <div className="milad-search-caption">
                    <span>Navigate faster</span>
                    <span>
                      <Icon name="command" size={12} /> K
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="milad-icon-btn"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={() =>
                setTheme((current) => current === "dark" ? "light" : "dark")
              }
            >
              <Icon
                key={theme}
                name={theme === "dark" ? "sun" : "moon"}
                size={18}
                className="milad-theme-icon"
              />
            </button>

            <a
              className="milad-subscribe"
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="play" size={15} />
              <span>Subscribe</span>
              <Icon name="arrow" size={13} />
            </a>

            <button
              type="button"
              className="milad-icon-btn milad-mobile-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} size={20} />
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="milad-mobile-panel">
            {navLinks.map((link) => (
              <a
                key={link.label}
                className="milad-mobile-link"
                href={link.href}
                onClick={closeMenus}
              >
                {link.label}
                <Icon name="arrow" size={14} />
              </a>
            ))}

            <button
              type="button"
              className="milad-mobile-link"
              aria-expanded={mobileToolsOpen}
              onClick={() => setMobileToolsOpen((value) => !value)}
            >
              <span>AI Tools</span>
              <Icon name="chevron" size={16} />
            </button>

            {mobileToolsOpen && (
              <div className="milad-mobile-tools">
                {TOOLS.map((tool) => (
                  <a
                    className="milad-mobile-tool"
                    key={tool.title}
                    href={tool.href}
                    onClick={closeMenus}
                  >
                    <Icon name={tool.icon} size={15} />
                    {tool.title}
                  </a>
                ))}
              </div>
            )}

            <a
              className="milad-subscribe milad-mobile-subscribe"
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="play" size={15} />
              <span>Subscribe on YouTube</span>
              <Icon name="arrow" size={13} />
            </a>
          </div>
        )}
      </div>
    </header>
  );
}