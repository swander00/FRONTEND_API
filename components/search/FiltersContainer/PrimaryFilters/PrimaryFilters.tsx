'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  useFiltersState,
  useFiltersDispatch,
  DEFAULT_FILTERS_STATE,
  type FiltersState,
} from '../FiltersContext';
import { STATUS_OPTIONS } from '@/lib/filters/options';
import { StatusButton, StatusDropdown } from './StatusFilter';
import { DateButton, DateDropdown } from './DateFilter';
import { CityButton, CityModal } from './CityFilter';
import { TypeButton, TypeModal } from './TypeFilter';
import { PriceButton, PriceModal } from './PriceFilter';
import { BedsButton, BedsModal } from './BedsFilter';
import { BathsButton, BathsModal } from './BathsFilter';
import {
  AdvancedButton,
  AdvancedFiltersModal,
  type AdvancedFiltersState,
} from './AdvancedFilters';
import { DEFAULT_FILTERS as ADVANCED_MODAL_DEFAULTS } from './AdvancedFilters/state';

type ActiveModal =
  | 'status'
  | 'time'
  | 'city'
  | 'type'
  | 'price'
  | 'beds'
  | 'baths'
  | 'advanced'
  | null;

const KEYWORD_DELIMITER = /[,;\n]/;

function splitKeywords(value: string): string[] {
  return value
    .split(KEYWORD_DELIMITER)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function mapContextAdvancedToModal(advanced: FiltersState['advanced']): AdvancedFiltersState {
  return {
    keyword: advanced.keywords.join(', '),
    propertyClass: advanced.propertyClasses[0] ?? '',
    houseStyle: advanced.houseStyle ?? '',
    lotFrontage: advanced.lotFrontage ?? '',
    lotDepth: advanced.lotDepth ?? '',
    squareFootageMin: advanced.squareFootage.min ?? ADVANCED_MODAL_DEFAULTS.squareFootageMin,
    squareFootageMax: advanced.squareFootage.max ?? ADVANCED_MODAL_DEFAULTS.squareFootageMax,
    maintenanceFeesMin: advanced.maintenanceFee.min ?? ADVANCED_MODAL_DEFAULTS.maintenanceFeesMin,
    maintenanceFeesMax: advanced.maintenanceFee.max ?? ADVANCED_MODAL_DEFAULTS.maintenanceFeesMax,
    propertyTaxMin: advanced.propertyTax.min ?? ADVANCED_MODAL_DEFAULTS.propertyTaxMin,
    propertyTaxMax: advanced.propertyTax.max ?? ADVANCED_MODAL_DEFAULTS.propertyTaxMax,
    daysOnMarketMin: advanced.daysOnMarket.min ?? ADVANCED_MODAL_DEFAULTS.daysOnMarketMin,
    daysOnMarketMax: advanced.daysOnMarket.max ?? ADVANCED_MODAL_DEFAULTS.daysOnMarketMax,
    garageParkingMin: advanced.garageParking.min ?? ADVANCED_MODAL_DEFAULTS.garageParkingMin,
    garageParkingMax: advanced.garageParking.max ?? ADVANCED_MODAL_DEFAULTS.garageParkingMax,
    totalParkingMin: advanced.totalParking.min ?? ADVANCED_MODAL_DEFAULTS.totalParkingMin,
    totalParkingMax: advanced.totalParking.max ?? ADVANCED_MODAL_DEFAULTS.totalParkingMax,
    propertyAge: advanced.propertyAge ?? '',
    hasSwimmingPool: advanced.swimmingPool ?? '',
    waterfront: advanced.waterfront ?? '',
    basementFeatures: [...advanced.basementFeatures],
    openHouseTiming: advanced.openHouse,
  };
}

function mapModalToContextAdvanced(state: AdvancedFiltersState): FiltersState['advanced'] {
  const toNullable = (value: number, defaultValue: number): number | null =>
    value === defaultValue ? null : value;

  const buildSliderRange = (
    minValue: number,
    maxValue: number,
    defaults: { min: number; max: number },
  ) => ({
    preset: 'Any' as const,
    min: toNullable(minValue, defaults.min),
    max: toNullable(maxValue, defaults.max),
  });

  return {
    keywords: splitKeywords(state.keyword),
    propertyClasses: state.propertyClass
      ? [state.propertyClass as FiltersState['advanced']['propertyClasses'][number]]
      : [],
    squareFootage: {
      min: toNullable(state.squareFootageMin, ADVANCED_MODAL_DEFAULTS.squareFootageMin),
      max: toNullable(state.squareFootageMax, ADVANCED_MODAL_DEFAULTS.squareFootageMax),
    },
    houseStyle: state.houseStyle || null,
    lotFrontage: state.lotFrontage || null,
    lotDepth: state.lotDepth || null,
    maintenanceFee: buildSliderRange(
      state.maintenanceFeesMin,
      state.maintenanceFeesMax,
      {
        min: ADVANCED_MODAL_DEFAULTS.maintenanceFeesMin,
        max: ADVANCED_MODAL_DEFAULTS.maintenanceFeesMax,
      },
    ),
    propertyTax: buildSliderRange(
      state.propertyTaxMin,
      state.propertyTaxMax,
      {
        min: ADVANCED_MODAL_DEFAULTS.propertyTaxMin,
        max: ADVANCED_MODAL_DEFAULTS.propertyTaxMax,
      },
    ),
    daysOnMarket: buildSliderRange(
      state.daysOnMarketMin,
      state.daysOnMarketMax,
      {
        min: ADVANCED_MODAL_DEFAULTS.daysOnMarketMin,
        max: ADVANCED_MODAL_DEFAULTS.daysOnMarketMax,
      },
    ),
    garageParking: buildSliderRange(
      state.garageParkingMin,
      state.garageParkingMax,
      {
        min: ADVANCED_MODAL_DEFAULTS.garageParkingMin,
        max: ADVANCED_MODAL_DEFAULTS.garageParkingMax,
      },
    ),
    totalParking: buildSliderRange(
      state.totalParkingMin,
      state.totalParkingMax,
      {
        min: ADVANCED_MODAL_DEFAULTS.totalParkingMin,
        max: ADVANCED_MODAL_DEFAULTS.totalParkingMax,
      },
    ),
    basementFeatures: [...state.basementFeatures],
    propertyAge: state.propertyAge || null,
    swimmingPool: state.hasSwimmingPool ? (state.hasSwimmingPool as 'Yes' | 'No') : null,
    waterfront: state.waterfront ? (state.waterfront as 'Yes' | 'No') : null,
    openHouse: state.openHouseTiming as FiltersState['advanced']['openHouse'],
  };
}

export function PrimaryFilters() {
  const filters = useFiltersState();
  const dispatch = useFiltersDispatch();
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const segmentedButtonClassName = 'first:rounded-s-full last:rounded-e-full';
  const timeRangeIsActive = useMemo(
    () => filters.timeRange !== DEFAULT_FILTERS_STATE.timeRange,
    [filters.timeRange],
  );
  const cityIsActive = useMemo(() => filters.cities.length > 0, [filters.cities.length]);
  const typeIsActive = useMemo(
    () => filters.propertyTypes.length > 0,
    [filters.propertyTypes.length],
  );
  const priceIsActive = useMemo(() => {
    const defaults = DEFAULT_FILTERS_STATE.price;
    const { preset, min, max } = filters.price;
    if (preset && preset !== defaults.preset) {
      return true;
    }
    return min != null || max != null;
  }, [filters.price]);
  const bedsIsActive = useMemo(() => {
    const defaults = DEFAULT_FILTERS_STATE.beds;
    const { preset, min, max, exact } = filters.beds;
    if (exact != null) {
      return true;
    }
    if (preset && preset !== defaults.preset) {
      return true;
    }
    return min != null || max != null;
  }, [filters.beds]);
  const bathsIsActive = useMemo(() => {
    const defaults = DEFAULT_FILTERS_STATE.baths;
    const { preset, min, max, exact } = filters.baths;
    if (exact != null) {
      return true;
    }
    if (preset && preset !== defaults.preset) {
      return true;
    }
    return min != null || max != null;
  }, [filters.baths]);

  const closeModal = () => setActiveModal(null);

  const advancedInitialFilters = useMemo(
    () => mapContextAdvancedToModal(filters.advanced),
    [filters.advanced],
  );

  const handleAdvancedApply = useCallback(
    (nextState: AdvancedFiltersState) => {
      dispatch({ type: 'ADVANCED_SET_ALL', payload: mapModalToContextAdvanced(nextState) });
    },
    [dispatch],
  );

  const statusSummary = useMemo(() => {
    const activeStatus = STATUS_OPTIONS.find((option) => option.value === filters.status);
    return {
      label: filters.status,
      color: activeStatus?.color ?? 'bg-blue-500',
      dotColor: activeStatus?.dotColor ?? '#2563eb',
      activeClassName:
        activeStatus?.buttonClass ??
        'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-200',
      buttonHex: activeStatus?.buttonHex ?? '#2563eb',
    };
  }, [filters.status]);
  const timeRangeSummary = useMemo(() => {
    if (filters.timeRange === 'Custom Date Range') {
      if (filters.timeRangeCustomDate) {
        const parsedDate = new Date(filters.timeRangeCustomDate);
        const isValidDate = !Number.isNaN(parsedDate.getTime());
        const formatted = isValidDate
          ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsedDate)
          : filters.timeRangeCustomDate;
        return `Since ${formatted}`;
      }
      return 'Custom Date';
    }
    return filters.timeRange;
  }, [filters.timeRange, filters.timeRangeCustomDate]);
  const citySummary = useMemo(() => {
    if (filters.cities.length === 0) {
      return 'All Cities';
    }
    if (filters.cities.length === 1) {
      return filters.cities[0];
    }
    return `${filters.cities[0]} +${filters.cities.length - 1}`;
  }, [filters.cities]);

  const typeSummary = useMemo(() => {
    if (filters.propertyTypes.length === 0) {
      return 'All Types';
    }
    if (filters.propertyTypes.length === 1) {
      return filters.propertyTypes[0];
    }
    return `${filters.propertyTypes[0]} +${filters.propertyTypes.length - 1}`;
  }, [filters.propertyTypes]);

  const priceSummary = useMemo(() => {
    const { min, max, preset } = filters.price;
    if (preset && preset !== 'Any') {
      return preset;
    }
    if (min == null && max == null) {
      return 'Any Price';
    }
    if (min != null && max != null) {
      return `$${(min / 1000).toLocaleString()}K - $${(max / 1000).toLocaleString()}K`;
    }
    if (min != null) {
      return `From $${min.toLocaleString()}`;
    }
    if (max != null) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Any Price';
  }, [filters.price]);

  const bedsSummary = useMemo(() => {
    const { preset, min, exact } = filters.beds;
    if (exact != null) {
      return `${exact} Beds`;
    }
    if (preset && preset !== 'Any') {
      return `${preset} Beds`;
    }
    if (min != null) {
      return `${min}+ Beds`;
    }
    return 'Any Beds';
  }, [filters.beds]);

  const bathsSummary = useMemo(() => {
    const { preset, min, exact } = filters.baths;
    if (exact != null) {
      return `${exact} Baths`;
    }
    if (preset && preset !== 'Any') {
      return `${preset} Baths`;
    }
    if (min != null) {
      return `${min}+ Baths`;
    }
    return 'Any Baths';
  }, [filters.baths]);

  return (
    <>
      <div className="flex items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex h-12 items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-md shadow-gray-200/50 ring-1 ring-gray-100/50 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/60 hover:ring-gray-200/60">
          <StatusButton
            ref={statusButtonRef}
            label={statusSummary.label}
            dotColor={statusSummary.dotColor}
            activeClassName={statusSummary.activeClassName}
            activeBackgroundColor={statusSummary.buttonHex}
            onClick={() => setActiveModal('status')}
            isActive
          />
          <DateButton
            ref={dateButtonRef}
            label={timeRangeIsActive ? timeRangeSummary : 'All Time'}
            onClick={() => setActiveModal('time')}
            isActive={timeRangeIsActive}
          />
        </div>

        <div className="flex h-12 overflow-hidden rounded-full border border-gray-200/80 bg-white shadow-md shadow-gray-200/50 ring-1 ring-gray-100/50 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/60 hover:ring-gray-200/60 divide-x divide-gray-300">
          <CityButton
            ref={cityButtonRef}
            label={cityIsActive ? citySummary : 'City'}
            title={citySummary}
            onClick={() => setActiveModal('city')}
            className={segmentedButtonClassName}
            isActive={cityIsActive}
          />
          <TypeButton
            label={typeIsActive ? typeSummary : 'Type'}
            title={typeSummary}
            onClick={() => setActiveModal('type')}
            className={segmentedButtonClassName}
            isActive={typeIsActive}
          />
          <PriceButton
            label={priceIsActive ? priceSummary : 'Price'}
            title={priceSummary}
            onClick={() => setActiveModal('price')}
            className={segmentedButtonClassName}
            isActive={priceIsActive}
          />
          <BedsButton
            label={bedsIsActive ? bedsSummary : 'Beds'}
            title={bedsSummary}
            onClick={() => setActiveModal('beds')}
            className={segmentedButtonClassName}
            isActive={bedsIsActive}
          />
          <BathsButton
            label={bathsIsActive ? bathsSummary : 'Baths'}
            title={bathsSummary}
            onClick={() => setActiveModal('baths')}
            className={segmentedButtonClassName}
            isActive={bathsIsActive}
          />
        </div>

        <AdvancedButton onClick={() => setActiveModal('advanced')} />
      </div>

      <StatusDropdown
        isOpen={activeModal === 'status'}
        onClose={closeModal}
        anchorRef={statusButtonRef}
      />
      <DateDropdown isOpen={activeModal === 'time'} onClose={closeModal} anchorRef={dateButtonRef} />
      <CityModal isOpen={activeModal === 'city'} onClose={closeModal} anchorRef={cityButtonRef} />
      <TypeModal isOpen={activeModal === 'type'} onClose={closeModal} />
      <PriceModal isOpen={activeModal === 'price'} onClose={closeModal} />
      <BedsModal isOpen={activeModal === 'beds'} onClose={closeModal} />
      <BathsModal isOpen={activeModal === 'baths'} onClose={closeModal} />
      <AdvancedFiltersModal
        isOpen={activeModal === 'advanced'}
        onClose={closeModal}
        onApply={handleAdvancedApply}
        initialFilters={advancedInitialFilters}
      />
    </>
  );
}


