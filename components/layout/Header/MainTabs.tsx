import Link from 'next/link';

type MainTabKey = 'search' | 'home-evaluation';

type MainTabsProps = {
  activeTab?: MainTabKey;
  className?: string;
};

const tabs: Array<{ key: MainTabKey; label: string; href: string }> = [
  { key: 'search', label: 'Search Homes', href: '/search' },
  {
    key: 'home-evaluation',
    label: 'Home Evaluation',
    href: '/home-evaluation',
  },
];

export function MainTabs({ activeTab = 'search', className = '' }: MainTabsProps) {
  const baseLinkStyles =
    'px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 whitespace-nowrap';

  return (
    <nav
      className={`flex flex-nowrap items-center gap-2 overflow-x-auto rounded-full bg-white/80 p-1 shadow-inner shadow-blue-50/40 backdrop-blur-sm sm:gap-3 ${className}`}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={activeTab === tab.key ? 'page' : undefined}
          className={`${baseLinkStyles} ${
            activeTab === tab.key
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

