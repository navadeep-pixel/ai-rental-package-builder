/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RentalItem {
  name: string;
  quantity: string;
  cost: number;
  reason: string;
}

export interface OptionalAddOn {
  name: string;
  cost: number;
  reason: string;
}

export interface BudgetSplit {
  equipment: number;
  accessories: number;
  miscellaneous: number;
}

export interface RentalPackage {
  packageName: string;
  items: RentalItem[];
  optionalAddOns: OptionalAddOn[];
  budgetSplit: BudgetSplit;
  benefits: string[];
  finalRecommendation: string;
}

export interface BackupEquipment {
  name: string;
  reason: string;
}

export interface RiskOmitted {
  equipment: string;
  risk: string;
}

export interface UpsellOpportunity {
  idea: string;
  description: string;
}

export interface ComparisonRow {
  feature: string;
  basic: string;
  recommended: string;
  premium: string;
}

export interface PackageResponse {
  basicPackage: RentalPackage;
  recommendedPackage: RentalPackage;
  premiumPackage: RentalPackage;
  backupEquipment: BackupEquipment[];
  risksIfOmitted: RiskOmitted[];
  upsellOpportunities: UpsellOpportunity[];
  comparisonTable: ComparisonRow[];
}

export interface UserInputs {
  usecase: string;
  people: string;
  budget: string;
  currency: string;
  duration: string;
  location: 'Indoor' | 'Outdoor';
  level: 'Beginner' | 'Intermediate' | 'Professional';
  requirements: string;
}
