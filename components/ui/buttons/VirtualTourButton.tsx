import { Button } from './Button';

type VirtualTourButtonProps = {
  imageCount: number;
  onClick?: () => void;
};

export function VirtualTourButton({ imageCount, onClick }: VirtualTourButtonProps) {
  return (
    <Button
      variant="primary"
      size="sm"
      className="absolute bottom-2 right-2 z-10 flex items-center gap-1"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      Tour
      <span className="ml-1">{imageCount}</span>
    </Button>
  );
}

