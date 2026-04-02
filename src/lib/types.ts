export type ProjectStage = 1 | 2 | 3 | 4 | 5 | 6;

export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  stage: ProjectStage;
  installedPowerKW: number;
  totalPanels: number;
  contractDate: string;
}

export interface EnergyRecord {
  month: string;
  generatedKWh: number;
  estimatedKWh: number;
  savingsMXN: number;
}
