import { formatPercentage, formatNumber } from 'common/format';
import CombatLogParser from 'parser/core/CombatLogParser';
import PropTypes from 'prop-types';

interface Props {
  amount: number;
  approximate?: boolean;
  greaterThan?: boolean;
  lessThan?: boolean;
  /**
   * @default {true}
   */
  displayPercentage?: boolean;
}
interface Context {
  parser: CombatLogParser;
}

const ItemHealingDone = (
  { amount, approximate, greaterThan, lessThan, displayPercentage = true }: Props,
  { parser }: Context,
) => (
  <>
    <img src="/img/healing.png" alt="Healing" className="icon" /> {approximate && '≈'}
    {greaterThan && '>'}
    {lessThan && '<'}
    {formatNumber((amount / parser.fightDuration) * 1000)} HPS{' '}
    {displayPercentage && (
      <small>{formatPercentage(parser.getPercentageOfTotalHealingDone(amount))}% of total</small>
    )}
  </>
);
ItemHealingDone.contextTypes = {
  parser: PropTypes.object.isRequired,
};

export default ItemHealingDone;
