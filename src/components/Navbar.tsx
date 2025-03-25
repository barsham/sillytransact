
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ActivitySquare, Cpu, LayoutDashboard, Settings, Server } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <ActivitySquare className="h-5 w-5" /> },
    { name: 'Status', path: '/status', icon: <Server className="h-5 w-5" /> },
    { name: 'Configuration', path: '/configuration', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-background/80 backdrop-blur-md transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-lg tracking-tight">SillyPostilion</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-4 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all-200"
        >
          {isCollapsed ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover-lift",
                location.pathname === item.path
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                isCollapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="relative h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">SP</span>
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-success"></span>
          </div>
          {!isCollapsed && (
            <div className="space-y-0.5">
              <p className="text-sm font-medium">System Online</p>
              <p className="text-xs text-muted-foreground">All services operational</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
