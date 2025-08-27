import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const sidebarNavItems = [
  { title: 'Profile', href: '#profile', active: true },
  { title: 'Account', href: '#account', active: false },
  { title: 'Appearance', href: '#appearance', active: false },
  { title: 'Notifications', href: '#notifications', active: false },
  { title: 'Display', href: '#display', active: false },
];

export function FormSidebar() {
  return (
    <aside className="w-64 border-r bg-background p-6">
      <nav className="space-y-2">
        {sidebarNavItems.map((item) => (
          <Button
            key={item.href}
            variant={item.active ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              item.active && 'bg-muted font-medium'
            )}
          >
            {item.title}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
