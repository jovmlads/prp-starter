import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserNavProps {
  isCollapsed: boolean;
}

export function UserNav({ isCollapsed }: UserNavProps) {
  return (
    <div className="mt-auto">
      <Separator className="my-4" />
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <User className="h-5 w-5 text-muted-foreground" />
        </Button>
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
