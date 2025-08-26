import { Home, LayoutDashboard, Settings, User } from 'lucide-react';
import { NavItem } from '@/types/nav';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

interface MainNavProps {
  isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-2">
      {mainNavItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <a
            key={index}
            href={item.href}
            className={cn(
              'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.title}</span>}
          </a>
        );
      })}
    </div>
  );
}
