import React from 'react';

/**
 * Age Filter Component for Children's Free Zone
 * Allows filtering products by age appropriateness
 */

export interface AgeRange {
  id: string;
  label: string;
  minAge: number;
  maxAge: number;
}

export const AGE_RANGES: AgeRange[] = [
  { id: 'infant', label: '0-2 years (Infant)', minAge: 0, maxAge: 2 },
  { id: 'toddler', label: '3-5 years (Toddler)', minAge: 3, maxAge: 5 },
  { id: 'child', label: '6-9 years (Child)', minAge: 6, maxAge: 9 },
  { id: 'preteen', label: '10-12 years (Preteen)', minAge: 10, maxAge: 12 },
  { id: 'teen', label: '13+ years (Teen)', minAge: 13, maxAge: 18 },
];

interface AgeFilterProps {
  selectedAges: string[];
  onAgeChange: (ages: string[]) => void;
}

export default function AgeFilter({ selectedAges, onAgeChange }: AgeFilterProps) {
  const handleAgeToggle = (ageId: string) => {
    if (selectedAges.includes(ageId)) {
      onAgeChange(selectedAges.filter(id => id !== ageId));
    } else {
      onAgeChange([...selectedAges, ageId]);
    }
  };

  return (
    <div className="age-filter bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter by Age</h3>
      
      <div className="space-y-3">
        {AGE_RANGES.map(range => (
          <label
            key={range.id}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedAges.includes(range.id)}
              onChange={() => handleAgeToggle(range.id)}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              aria-label={`Filter for ${range.label}`}
            />
            <span className="text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>

      {selectedAges.length > 0 && (
        <button
          onClick={() => onAgeChange([])}
          className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

/**
 * Helper function to check if a product matches selected age ranges
 */
export function matchesAgeFilter(
  productAgeRange: { minAge: number; maxAge: number },
  selectedAgeIds: string[]
): boolean {
  if (selectedAgeIds.length === 0) return true;

  return selectedAgeIds.some(ageId => {
    const range = AGE_RANGES.find(r => r.id === ageId);
    if (!range) return false;

    // Check if there's any overlap between product age range and selected filter
    return (
      productAgeRange.minAge <= range.maxAge &&
      productAgeRange.maxAge >= range.minAge
    );
  });
}
