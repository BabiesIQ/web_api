import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES, applyDocumentDir } from "../lib/i18n";
import { ThemeSwitcher } from "./ThemeSwitcher";

const NAV_KEYS = [
  { key: "home", to: "/" },
  { key: "docs", to: "/docs" },
  { key: "pricing", to: "/pricing" },
  { key: "contact", to: "/contact" },
];

// ── Language Dropdown ─────────────────────────────────────────────────────────
function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLang = (i18n.language || "en").slice(0, 2);
  const currentLangData =
    SUPPORTED_LANGUAGES.find((l) => currentLang.startsWith(l.code)) ??
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-1.5 h-8 px-2.5 rounded-lg hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
        aria-label="Change language"
        aria-expanded={open}
        data-ocid="header.lang_switcher.button"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {currentLangData.flag}
        </span>
        <span className="hidden lg:inline text-xs font-medium">
          {currentLang.toUpperCase()}
        </span>
        <ChevronDown
          className={`h-3 w-3 opacity-50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-elevated z-50 overflow-hidden"
            data-ocid="header.lang_dropdown.popover"
          >
            <div className="p-1.5 max-h-72 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = (i18n.language || "en").startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      applyDocumentDir(lang.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-ocid={`header.lang.${lang.code}.button`}
                  >
                    <span className="text-base leading-none w-5 shrink-0">
                      {lang.flag}
                    </span>
                    <span className="flex-1 truncate">{lang.nativeName}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  const displayName =
    user?.user?.first_name || user?.user?.email?.split("@")[0] || "Account";
  const avatarUrl = user?.user?.avatar ?? null;

  // Scroll state for elevated header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-card/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "border-border/40 bg-card/80 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      }`}
      data-ocid="header"
    >
      {/* Scroll progress bar */}
      <div className="scroll-progress" id="scroll-progress" />

      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 font-display font-bold text-xl text-foreground hover:opacity-90 transition-opacity duration-200 shrink-0"
          data-ocid="header.logo.link"
        >
          <span className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-gradient">Baby</span>
          <span>API</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 mx-8">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted/70 group"
              activeProps={{ className: "text-foreground bg-muted/50" }}
              data-ocid={`nav.${link.key}.link`}
            >
              {t(`nav.${link.key}`)}
              <span className="absolute inset-x-3 -bottom-px h-[1.5px] bg-gradient-to-r from-primary to-accent opacity-0 group-[.active]:opacity-100 transition-opacity duration-200 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <ThemeSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-1">
              {/* Notification bell */}
              <Link
                to="/panel/notifications"
                className="relative flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                aria-label="Notifications"
                data-ocid="header.notifications.link"
              >
                <Bell className="w-4 h-4" />
              </Link>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 h-8 pl-2 pr-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    data-ocid="header.user_menu.button"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">
                          {displayName.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-medium max-w-[100px] truncate text-foreground">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="pb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">
                          {displayName.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user?.user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/panel/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="header.dashboard.link"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 opacity-60" />
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/panel/profile-settings"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="header.profile.link"
                    >
                      <Settings className="w-3.5 h-3.5 opacity-60" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    data-ocid="header.logout.button"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 text-sm font-medium hover:text-foreground"
                data-ocid="header.login.button"
              >
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="h-8 gradient-primary text-white font-semibold text-sm px-4 shadow-sm hover:opacity-90 transition-opacity"
                data-ocid="header.signup.button"
              >
                <Link to="/signup">{t("nav.signup")}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            data-ocid="header.mobile_menu.toggle"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="border-t border-border bg-card px-4 pb-5 pt-3">
              {/* Nav links */}
              <nav className="flex flex-col gap-0.5 mb-4">
                {NAV_KEYS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className="flex items-center text-sm font-medium py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                      onClick={() => setMobileOpen(false)}
                      activeProps={{ className: "text-foreground bg-muted" }}
                      data-ocid={`nav.mobile.${link.key}.link`}
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Auth section */}
              <div className="pt-3 border-t border-border">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/panel/dashboard"
                      className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                      onClick={() => setMobileOpen(false)}
                      data-ocid="header.mobile_dashboard.link"
                    >
                      <LayoutDashboard className="w-4 h-4 opacity-60" />
                      {t("nav.dashboard")}
                    </Link>
                    <Link
                      to="/panel/profile-settings"
                      className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                      onClick={() => setMobileOpen(false)}
                      data-ocid="header.mobile_profile.link"
                    >
                      <User className="w-4 h-4 opacity-60" />
                      {t("nav.settings")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200 w-full text-left"
                      data-ocid="header.mobile_logout.button"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.logout")}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-center"
                      data-ocid="header.mobile_login.button"
                    >
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        {t("nav.login")}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="w-full justify-center gradient-primary text-white font-semibold"
                      data-ocid="header.mobile_signup.button"
                    >
                      <Link to="/signup" onClick={() => setMobileOpen(false)}>
                        {t("nav.signup")}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
