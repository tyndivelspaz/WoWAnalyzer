import MainCombatLogParser from 'parser/core/CombatLogParser';

import Abilities from '../shared/modules/Abilities';

import LivingFlame from '../shared/modules/core/LivingFlame';
import EssenceBurstDevastation from './modules/talents/EssenceBurst';

class CombatLogParser extends MainCombatLogParser {
  static specModules = {
    abilities: Abilities,

    livingFlame: LivingFlame,
    essenceBurst: EssenceBurstDevastation,
  };
}

export default CombatLogParser;
