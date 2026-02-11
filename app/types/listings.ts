export interface FilterState {
  targetInstitution: string;
  distanceFromTargetInstitution: {
    val: number;
    unit: string;
    maxRange: number;
    step: number;
  };
  min: number;
  max: number;
  maxRange: number;
  selected_institutions: string[];
  selectedPropertyTypes: string[];
  country: string;
  city: string;
  verifiedOnly: boolean;
  furnished: boolean;
  availableNow: boolean;
}