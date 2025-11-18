'use client';

import { Icon } from '@/components/ui/icons/Icon';
import { IconButton } from '@/components/ui/buttons/IconButton';
import { cn } from '@/lib/utils';

export type ModalHeaderProps = {
  title: string;
  onClose: () => void;
  description?: string;
  className?: string;
};

export function ModalHeader({ title, onClose, description, className }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-5',
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500">{description}</p> : null}
      </div>
      <IconButton
        ariaLabel="Close filters"
        onClick={onClose}
        icon={<Icon name="close" className="h-5 w-5 text-gray-500" />}
        className="h-9 w-9 border border-gray-200 bg-white/80 shadow-sm hover:bg-gray-50"
      />
    </div>
  );
}


