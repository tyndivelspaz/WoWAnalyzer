import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import { When } from 'parser/core/ParseResults';
import CoreAlwaysBeCasting from 'parser/shared/modules/AlwaysBeCasting';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  suggestions(when: When) {
    when(this.downtimePercentage)
      .isGreaterThan(0.1)
      .addSuggestion((suggest, actual, recommended) =>
        suggest(
          <>
            Your downtime can be improved. Try to Always Be Casting (ABC), try to reduce the delay
            between casting spells. Even if you have to move, try casting something instant. Make
            good use of your <SpellLink id={SPELLS.DEMONIC_CIRCLE.id} /> or{' '}
            <SpellLink id={SPELLS.BURNING_RUSH_TALENT.id} /> when you can.
          </>,
        )
          .icon('spell_mage_altertime')
          .actual(
            t({
              id: 'warlock.demonology.suggestions.alwaysBeCasting.downtime',
              message: `${formatPercentage(actual)}% downtime`,
            }),
          )
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.1)
          .major(recommended + 0.2),
      );
  }
}

export default AlwaysBeCasting;
