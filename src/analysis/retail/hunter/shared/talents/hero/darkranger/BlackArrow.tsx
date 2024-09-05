import SpellUsable from 'analysis/classic/hunter/shared/SpellUsable';
import { BA_PROC_CHANCE } from 'analysis/retail/hunter/marksmanship/constants';
import SPELLS from 'common/SPELLS';
import { TALENTS_HUNTER } from 'common/TALENTS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { ApplyBuffEvent, DamageEvent } from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import { expectedProcCount } from 'parser/shared/modules/helpers/Probability';

class BlackArrow extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilities: Abilities,
  };
  blackArrowDotDamage: number = 0;
  blackArrowDamageTicks: number = 0;
  witheringFireDamage: number = 0;
  hasWitheringFireBuff: boolean = false;
  aimShotChargesRefunded: number = 0;

  protected spellUsable!: SpellUsable;
  protected abilities!: Abilities;

  constructor(options: Options) {
    super(options);
    this.active =
      this.selectedCombatant.hasTalent(TALENTS_HUNTER.BLACK_ARROW_TALENT) &&
      this.selectedCombatant.hasTalent(TALENTS_HUNTER.WITHERING_FIRE_TALENT);

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.BLACK_ARROW),
      this.onBlackArrowDamage,
    );

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.WITHERING_FIRE),
      this.onWitheringFireDamage,
    );

    this.addEventListener(
      Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.WITHERING_FIRE_BUFF),
      this.onWitheringFireBuff,
    );
  }

  get expectedProcs() {
    return expectedProcCount(BA_PROC_CHANCE, this.blackArrowDamageTicks);
  }

  onBlackArrowDamage(event: DamageEvent) {
    this.blackArrowDotDamage += event.amount;
  }

  onWitheringFireDamage(event: DamageEvent) {
    this.witheringFireDamage += event.amount;
  }

  onWitheringFireBuff(event: ApplyBuffEvent) {
    this.aimShotChargesRefunded += 1;
    this.hasWitheringFireBuff = true;
    if (this.spellUsable.isOnCooldown(TALENTS_HUNTER.AIMED_SHOT_TALENT.id)) {
      const expectedCooldownDuration = this.abilities.getExpectedCooldownDuration(
        TALENTS_HUNTER.AIMED_SHOT_TALENT.id,
      );
      if (expectedCooldownDuration) {
        const newChargeCDR =
          expectedCooldownDuration -
          this.spellUsable.cooldownRemaining(TALENTS_HUNTER.AIMED_SHOT_TALENT.id);
        this.spellUsable.reduceCooldown(TALENTS_HUNTER.AIMED_SHOT_TALENT.id, newChargeCDR);
      }
    }
  }
}

export default BlackArrow;
