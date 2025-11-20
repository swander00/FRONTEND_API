"use client";

import React, { type ReactNode } from "react";

import { PropertyDetailsBaseModal } from "@/components/property/PropertyDetails/PropertyDetailsBaseModal";
import { cn } from "@/lib/utils";

type PropertyDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  className?: string;
  children: ReactNode;
};

export function PropertyDetailsModal({
  open,
  onClose,
  title,
  description,
  showCloseButton = true,
  className,
  children,
}: PropertyDetailsModalProps) {
  const isOpenValue = Boolean(open);
  
  return (
    <PropertyDetailsBaseModal
      isOpen={isOpenValue}
      onClose={onClose}
      size="full"
      contentClassName="h-full"
      className={cn("bg-white shadow-2xl", className)}
    >
      {(title || description || showCloseButton) && (
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-3">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:text-gray-800"
              aria-label="Close property details"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      )}
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </PropertyDetailsBaseModal>
  );
}


