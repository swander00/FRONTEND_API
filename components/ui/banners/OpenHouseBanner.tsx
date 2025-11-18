type OpenHouseBannerProps = {
  day: string;
  date: string;
  time: string;
};

export function OpenHouseBanner({ day, date, time }: OpenHouseBannerProps) {
  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white text-blue-600 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shadow-md">
        Open House - {day}, {date}, {time}
      </div>
    </div>
  );
}

