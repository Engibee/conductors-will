import { stakeHoldingTrading } from "../../composables/gameState";

export function checkStakeGameBegin() {
  return (
    stakeHoldingTrading.Governments.stake === 0 &&
    stakeHoldingTrading.TechCorporations.stake === 0 &&
    stakeHoldingTrading.FinancialFunds.stake === 0 &&
    stakeHoldingTrading.NGOs.stake === 0 &&
    stakeHoldingTrading.You === 0
  );
}
