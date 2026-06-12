import { atom } from 'jotai';
import { HoveredZone } from './mapTypes';

export const loadingMapAtom = atom(true);

export const mousePositionAtom = atom({
  x: 0,
  y: 0,
});

export const hoveredZoneAtom = atom<HoveredZone | null>(null);

export const mapMovingAtom = atom(false);

export interface HoveredDistributor {
  ysh_name: string;
  ysh_boundary_type: 'concessionaria' | 'permissionaria';
  ysh_area_km2: number;
  featureId: string | number;
  source: string;
  sourceLayer?: string;
}

export const hoveredDistributorAtom = atom<HoveredDistributor | null>(null);

