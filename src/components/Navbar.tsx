
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import StatusIndicator from './StatusIndicator';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Activity, 
  Settings, 
  FileText,
  LifeBuoy, 
  LogOut, 
  HelpCircle 
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/transactions', label: 'Transactions', icon: <ReceiptText className="w-5 h-5" /> },
  { href: '/status', label: 'System Status', icon: <Activity className="w-5 h-5" /> },
  { href: '/configuration', label: 'Configuration', icon: <Settings className="w-5 h-5" /> },
  { href: '/test', label: 'Test Harness', icon: <FileText className="w-5 h-5" /> },
];

const Navbar = () => {
  const location = useLocation();
  
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 glass-sidebar border-r border-border/40 pt-6 pb-10 px-3 flex flex-col">
      <div className="px-4 py-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground w-5 h-5">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SillyPostilion</h1>
            <div className="flex items-center mt-0.5">
              <StatusIndicator status="online" className="scale-90" />
            </div>
          </div>
        </div>
      </div>
      
      <nav className="space-y-1 px-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              location.pathname === link.href
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto space-y-1 px-2">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50">
          <HelpCircle className="w-5 h-5" />
          Help & Resources
        </button>
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50">
          <LifeBuoy className="w-5 h-5" />
          Support
        </button>
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
