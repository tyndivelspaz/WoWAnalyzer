import { t } from '@lingui/macro';
import { SPELL_COLORS } from '../../constants';
import SPELLS from 'common/SPELLS';
import { TALENTS_EVOKER } from 'common/TALENTS';
import { SpellLink } from 'interface';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { EventType, RemoveBuffEvent, RemoveBuffStackEvent } from 'parser/core/Events';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DonutChart from 'parser/ui/DonutChart';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import { getEssenceBurstConsumeAbility } from '../../normalizers/CastLinkNormalizer';

/**
 * Following the same set-up created by trevorm4 in Preservation
 * to keep consistency between the specs.
 */

const ESSENCE_COSTS: { [name: string]: number } = {
  Pyre: 2,
  Disintegrate: 3,
};

class EssenceBurstDevastation extends Analyzer {
  totalConsumed: number = 0;
  totalExpired: number = 0;
  essenceSaved: number = 0;
  consumptionCount: { [name: string]: number } = { Pyre: 0, Disintegrate: 0 };

  constructor(options: Options) {
    super(options);
    this.active =
      this.selectedCombatant.hasTalent(TALENTS_EVOKER.AZURE_ESSENCE_BURST_TALENT) &&
      this.selectedCombatant.hasTalent(TALENTS_EVOKER.RUBY_ESSENCE_BURST_TALENT);

    this.addEventListener(
      Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.ESSENCE_BURST_DEVASTATION_BUFF),
      this.onBuffRemove,
    );
    if (this.selectedCombatant.hasTalent(TALENTS_EVOKER.ESSENCE_ATTUNEMENT_TALENT)) {
      this.addEventListener(
        Events.removebuffstack.by(SELECTED_PLAYER).spell(SPELLS.ESSENCE_BURST_DEVASTATION_BUFF),
        this.onBuffRemove,
      );
    }
  }

  onBuffRemove(event: RemoveBuffEvent | RemoveBuffStackEvent) {
    const consumeAbility = getEssenceBurstConsumeAbility(event);
    if (consumeAbility) {
      const spellName = consumeAbility.ability.name;
      this.totalConsumed += 1;
      this.essenceSaved += ESSENCE_COSTS[spellName];
      this.consumptionCount[spellName] += 1;
    } else if (event.type === EventType.RemoveBuff) {
      this.totalExpired += 1;
    } else {
      this.totalExpired += (event as RemoveBuffStackEvent).stack;
    }
  }

  renderDonutChart() {
    const items = [
      {
        color: SPELL_COLORS.DISINTEGRATE,
        label: 'Disinitegrate',
        spallId: SPELLS.DISINTEGRATE.id,
        value: this.consumptionCount['Disintegrate'],
        valueTooltip: this.consumptionCount['Disinitegrate'],
      },
      {
        color: SPELL_COLORS.PYRE,
        label: 'Pyre',
        spellId: TALENTS_EVOKER.PYRE_TALENT.id,
        value: this.consumptionCount['Pyre'],
        valueTooltip: this.consumptionCount['Pyre'],
      },
    ].filter((item) => item.value > 0);
    return <DonutChart items={items} />;
  }

  get suggestionThresholds() {
    return {
      actual: this.totalExpired,
      isGreaterThan: {
        major: 0,
      },
      style: ThresholdStyle.NUMBER,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to avoid wasting <SpellLink id={TALENTS_EVOKER.ESSENCE_BURST_TALENT.id} /> stacks.
        </>,
      )
        .icon(TALENTS_EVOKER.ESSENCE_BURST_TALENT.icon)
        .actual(
          `${actual} ${t({
            id: 'evoker.devastation.suggestions.essenceBurst.wastedStacks',
            message: ' wasted Essence Burst stacks',
          })}`,
        )
        .recommended(`${recommended} wasted stacks recommended`),
    );
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={STATISTIC_CATEGORY.TALENTS}
      >
        <div className="pad">
          <label>
            <SpellLink id={SPELLS.ESSENCE_BURST_DEVASTATION_BUFF.id} /> consumption by spell
          </label>
          {this.renderDonutChart()}
        </div>
      </Statistic>
    );
  }
}

export default EssenceBurstDevastation;
