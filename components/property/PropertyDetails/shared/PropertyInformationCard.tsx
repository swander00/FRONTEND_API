import { Building, Building2, Car, Home, Info, SquareStack, Star, Waves, Zap } from "lucide-react";
import { CollapsibleSection } from "../ui";
import type { PropertyDetailsData } from "../normalizeProperty";
import { getCondoInfoFields } from "../sections/condoInfoFields";
import {
  getBasementFields,
  getFeatureLists,
  getListingInformationFields,
  getParkingFields,
  getPoolWaterfrontFields,
  getPropertyDetailFields,
  getUtilitiesFields,
} from "./sectionFields";

interface PropertyInformationCardProps {
  property: PropertyDetailsData;
}

export function PropertyInformationCard({ property }: PropertyInformationCardProps) {
  const listingFields = getListingInformationFields(property);
  const propertyDetails = getPropertyDetailFields(property);
  const basementFields = getBasementFields(property);
  const parkingFields = getParkingFields(property);
  const utilitiesFields = getUtilitiesFields(property);
  const poolFields = getPoolWaterfrontFields(property);
  const featureLists = getFeatureLists(property);
  const { interior, exterior, other } = featureLists;

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Property Information</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Detailed property specifications</p>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
      </div>
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
        <CollapsibleSection title="Listing Information" icon={Info} colorScheme="blue" defaultExpanded>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {listingFields.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className={`text-sm font-semibold truncate ${item.highlight ? "text-blue-900" : "text-gray-900"}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Property Details" icon={Home} colorScheme="green" defaultExpanded>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {propertyDetails.map((detail, index) => (
              <div key={`${detail.label}-${index}`} className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">{detail.label}</p>
                <p className={`text-xs sm:text-sm font-semibold truncate ${detail.highlight ? "text-green-900" : "text-gray-900"}`}>{detail.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Basement Features" icon={SquareStack} colorScheme="amber" defaultExpanded>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {basementFields.map((feature, index) => (
              <div key={`${feature.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{feature.label}</p>
                <p className={`text-sm font-semibold truncate ${feature.highlight ? "text-amber-900" : "text-gray-900"}`}>{feature.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Condo Information" icon={Building} colorScheme="indigo" defaultExpanded>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {getCondoInfoFields(property).map((field, index) => (
              <div key={`${field.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{field.label}</p>
                <p className={`text-sm font-semibold truncate ${field.highlight ? "text-indigo-900" : "text-gray-900"}`}>{field.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Parking & Garage" icon={Car} colorScheme="orange" defaultExpanded>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parkingFields.map((parking, index) => (
              <div key={`${parking.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{parking.label}</p>
                <p className={`text-sm font-semibold truncate ${parking.highlight ? "text-orange-900" : "text-gray-900"}`}>{parking.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Utilities & Services" icon={Zap} colorScheme="cyan" defaultExpanded>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {utilitiesFields.map((utility, index) => (
              <div key={`${utility.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{utility.label}</p>
                <p className={`text-sm font-semibold truncate ${utility.highlight ? "text-cyan-900" : "text-gray-900"}`}>{utility.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Pool & Waterfront" icon={Waves} colorScheme="blue" defaultExpanded>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {poolFields.map((feature, index) => (
              <div key={`${feature.label}-${index}`} className="flex flex-col gap-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{feature.label}</p>
                <p className={`text-sm font-semibold truncate ${feature.highlight ? "text-blue-900" : "text-gray-900"}`}>{feature.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Property Features" icon={Star} colorScheme="pink" defaultExpanded>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Interior Features</h3>
              <div className="flex flex-wrap gap-2">
                {interior.map((feature) => (
                  <span key={feature} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Exterior Features</h3>
              <div className="flex flex-wrap gap-2">
                {exterior.map((feature) => (
                  <span key={feature} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Other Features</h3>
              <div className="flex flex-wrap gap-2">
                {other.map((feature) => (
                  <span key={feature} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}


