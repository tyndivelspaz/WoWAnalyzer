import SPELLS from 'common/SPELLS';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';

import DanceDamageTracker from '../../core/DanceDamageTracker';
import DarkShadow from './DarkShadow';

class DarkShadowContribution extends DarkShadow {
  static dependencies = {
    ...DarkShadow.dependencies,
    danceDamageTracker: DanceDamageTracker,
  };

  protected danceDamageTracker!: DanceDamageTracker;

  get darkShadowDamageFactor() {
    return 0.25;
  }

  statistic() {
    const danceDamage =
      (Object.keys(this.danceDamageTracker.abilities)
        .map(
          (abilityId) =>
            this.danceDamageTracker.abilities.get(parseInt(abilityId))?.damageEffective || 0,
        )
        .reduce((a, b) => a + b, 0) *
        this.darkShadowDamageFactor) /
      (1 + this.darkShadowDamageFactor);

    return (
      <Statistic size="flexible" category={STATISTIC_CATEGORY.GENERAL}>
        <BoringSpellValueText spellId={SPELLS.DARK_SHADOW_TALENT.id}>
          <ItemDamageDone amount={danceDamage} />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default DarkShadowContribution;
