import SPELLS from 'common/SPELLS';
import { TALENTS_HUNTER } from 'common/TALENTS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { DamageEvent } from 'parser/core/Events';

class BlackArrow extends Analyzer {
  blackArrowDotDamage: number = 0;
  witheringFireDamage: number = 0;
  aimShotCharges: number = 0;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(TALENTS_HUNTER.BLACK_ARROW_TALENT);

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.BLACK_ARROW),
      this.onBlackArrowDamage,
    );

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.WITHERING_FIRE),
      this.onWitheringFireDamage,
    );
  }

  onBlackArrowDamage(event: DamageEvent) {
    this.blackArrowDotDamage += event.amount;
  }

  onWitheringFireDamage(event: DamageEvent) {
    this.witheringFireDamage += event.amount;
  }
}

export default BlackArrow;
