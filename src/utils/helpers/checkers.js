import { useStakeHoldingTradingStore } from "../../stores/stakeTrading.js";

export function checkStakeGameBegin() {
  const stakeHoldingTrading = useStakeHoldingTradingStore();

  return (
    stakeHoldingTrading.Governments.stake === 0 &&
    stakeHoldingTrading.TechCorporations.stake === 0 &&
    stakeHoldingTrading.FinancialFunds.stake === 0 &&
    stakeHoldingTrading.NGOs.stake === 0 &&
    stakeHoldingTrading.You === 0
  );
}
