type IconName =
  | 'bed'
  | 'bath'
  | 'car'
  | 'square'
  | 'bookmark'
  | 'heart'
  | 'filter'
  | 'view'
  | 'expand'
  | 'close'
  | 'share'
  | 'location'
  | 'home'
  | 'currency'
  | 'info'
  | 'map'
  | 'map-pin'
  | 'parking';

type IconProps = {
  name: IconName;
  className?: string;
};

const ICON_PATHS: Record<IconName, string> = {
  bed: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  bath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  car: 'M8 7h8m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v10m8-10v10',
  square: 'M4 8h16M4 8v8h16V8M4 8V4h16v4',
  bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  filter: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
  view: 'M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7zM12 9a3 3 0 100 6 3 3 0 000-6z',
  expand: 'M15 3h6v6m-2-4-5.5 5.5M9 21H3v-6m2 4 5.5-5.5',
  close: 'M6 6l12 12M6 18L18 6',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4m4-4v14',
  location: 'M12 21l-7.2-8.1a7.75 7.75 0 1114.4 0L12 21zm0-10a3 3 0 100-6 3 3 0 000 6z',
  home: 'M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5h-4v5a1 1 0 01-1 1H4a1 1 0 01-1-1z',
  currency: 'M12 6v12m4-10H9a3 3 0 100 6h6a3 3 0 100-6H8',
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 14a1 1 0 110-2 1 1 0 010 2zm1-9h-2v6h2V7z',
  map: 'M9 20.25l-5.447-2.723A2 2 0 012 15.71V5.54a2 2 0 011.553-1.955l5-1.111a2 2 0 01.894 0l5 1.11a2 2 0 00.894 0l5-1.11A2 2 0 0122 5.54v10.17a2 2 0 01-1.553 1.816L15 19.5l-5-1.5-5 2.25z',
  'map-pin': 'M12 21s-7-6.364-7-11a7 7 0 1114 0c0 4.636-7 11-7 11zm0-9a3 3 0 100-6 3 3 0 000 6z',
  parking:
    'M12 3a9 9 0 110 18 9 9 0 010-18zm-1 6v12m0-12h3a3 3 0 010 6h-3',
};

export function Icon({ name, className = 'w-5 h-5' }: IconProps) {
  const path = ICON_PATHS[name];

  if (!path) {
    return null;
  }

  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );
}

