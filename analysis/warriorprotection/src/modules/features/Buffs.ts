import SPELLS from 'common/SPELLS';
import BLOODLUST_BUFFS from 'game/BLOODLUST_BUFFS';
import CoreAuras from 'parser/core/modules/Auras';

class Buffs extends CoreAuras {
  //TODO: Get shrike to fill this out since I'm lazy
  auras() {
    //const combatant = this.selectedCombatant;

    // This should include ALL buffs that can be applied by your spec.
    // This data can be used by various kinds of modules to improve their results, and modules added in the future may rely on buffs that aren't used today.
    return [
      {
        spellId: Object.keys(BLOODLUST_BUFFS).map((item) => Number(item)),
        timelineHighlight: true,
      },
      {
        spellId: SPELLS.AVATAR_TALENT.id,
        timelineHighlight: true,
      },
      {
        spellId: SPELLS.LAST_STAND.id,
        timelineHighlight: true,
      },
      {
        spellId: SPELLS.SHIELD_BLOCK_BUFF.id,
        timelineHighlight: true,
      },
      {
        spellId: SPELLS.SHIELD_WALL.id,
        timelineHighlight: true,
      },
      {
        spellId: SPELLS.SPELL_REFLECTION.id,
        timelineHighlight: true,
      },
    ];
  }
}

export default Buffs;
