import { FormSidebar } from '@/components/forms/FormSidebar';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Separator } from '@/components/ui/separator';

export default function FormPage() {
  return (
    <div className="flex h-full">
      <FormSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator />
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
