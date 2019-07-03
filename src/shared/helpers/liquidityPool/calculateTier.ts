import { ITier, ITierGroup } from 'shared/types/models/liquidityPool';
import { formatDecimalIfLarge as addCommas, roundFloat } from 'shared/helpers/number';
import { removeCommas } from 'shared/helpers/liquidityPool';
import { poolTiers } from 'shared/mocks/liquidityPool';

const pluckTier = (tiers: ITier[], usersTIO: number) => {
  const filteredTiers = tiers.filter(t => usersTIO >= t.tier);
  const currentTier = filteredTiers.pop();
  return currentTier ? `Rank ${currentTier.rank}` : null;
};

export const getTierValue = (usersTIO: number) => pluckTier(poolTiers, usersTIO);

// (LP Return × 50%) × (My TIOx / Total Pool Assets) × Tier Multiplier % in chart.
export const calculateReturn = (myTio: string, totalTioPool: string, lpReturnValue: string, tiers: ITierGroup[]) => {
  const myTioClean = removeCommas(myTio);
  const lpReturnClean = removeCommas(lpReturnValue.toString());
  const totalPoolClean = removeCommas(totalTioPool.toString());
  const selectedTier = tiers.filter((tier: ITierGroup) => tier.bold);
  const { percent } = selectedTier[0];
  const myReturn = (lpReturnClean * 0.50) * (myTioClean / totalPoolClean * parseFloat(percent));
  return addCommas(roundFloat((myReturn / 100), 2));
};
