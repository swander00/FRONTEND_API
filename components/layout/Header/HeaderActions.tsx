import { AuthTriggerButton } from '@/components/auth';

type HeaderActionsProps = {
  className?: string;
};

export function HeaderActions({ className = '' }: HeaderActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      <AuthTriggerButton className="sm:px-6" />
    </div>
  );
}

