import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  BuildingIcon,
  DiscoverIcon,
  OpportunityIcon,
  MenuIcon,
  XIcon,
  SparklesIcon,
  PlusIcon,
} from "./Icons";

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isBusinessesActive = () => {
    return (
      location.pathname.startsWith("/businesses") ||
      location.hash === "#businesses"
    );
  };

  const navItems = [
    {
      name: "Dashboard",
      to: "/",
      icon: DashboardIcon,
      active: isActive("/") && location.hash !== "#businesses",
    },
    {
      name: "Businesses",
      to: "/#businesses",
      icon: BuildingIcon,
      active: isBusinessesActive() && location.pathname !== "/businesses/new",
    },
    {
      name: "Discover",
      to: "/discover",
      icon: DiscoverIcon,
      active: isActive("/discover"),
    },
    {
      name: "Opportunities",
      to: "/opportunities",
      icon: OpportunityIcon,
      active: isActive("/opportunities"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-sans text-[#17252c] antialiased flex flex-col md:flex-row">
      {/* Mobile Top Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-[#31444c] bg-[#17252c] px-4 text-white md:hidden sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c8643e] text-white">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <span>
            Prospect<span className="text-[#e4a58d]">IQ</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-slate-400 hover:bg-[#263941] hover:text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile navigation */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#17252c]/60 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#31444c] bg-[#17252c] text-slate-300 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#31444c] px-6">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c8643e] text-white group-hover:bg-[#d87550] transition-colors">
              <SparklesIcon className="w-4.5 h-4.5 text-white" />
            </div>
            <span>
              Prospect<span className="text-[#e4a58d]">IQ</span>
            </span>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-5 pb-2">
          <Link
            to="/businesses/new"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#c8643e] px-3.5 py-2.5 text-sm font-medium text-white hover:bg-[#d87550] active:bg-[#a94e30] transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Business</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  item.active
                    ? "bg-[#263941] text-[#e4a58d] border-l-2 border-[#c8643e] pl-3 font-semibold"
                    : "text-slate-400 hover:bg-[#263941] hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    item.active
                      ? "text-[#e4a58d]"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Workspace Footer Indicator */}
        <div className="border-t border-[#31444c] p-4">
          <div className="flex items-center gap-3 rounded-md bg-[#263941] p-2.5">
            <div className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#79b7a6]"></span>
            </div>
            <div className="truncate text-xs">
              <p className="font-medium text-slate-200 truncate">ProspectIQ Workspace</p>
              <p className="text-[11px] text-slate-400">Intelligence Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
