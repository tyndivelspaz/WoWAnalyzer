import {
  AMurderOfCrows,
  Barrage,
  BindingShot,
  BornToBeWild,
  CancelledCasts,
  Channeling,
  DeathChakrams,
  DeathTracker,
  FocusDetails,
  FocusTracker,
  KillShot,
  NaturalMending,
  RejuvenatingWind,
  SpellFocusCost,
  SteelTrap,
  Trailblazer,
  TranquilizingShot,
  WailingArrow,
  WailingArrowPrepullNormalizer,
} from '../shared';
import CoreCombatLogParser from 'parser/core/CombatLogParser';
import ArcaneTorrent from 'parser/shared/modules/racials/bloodelf/ArcaneTorrent';

import Abilities from './modules/Abilities';
import Buffs from './modules/Buffs';
import Checklist from './modules/checklist/Module';
import GlobalCooldown from './modules/core/GlobalCooldown';
import SpellUsable from './modules/core/SpellUsable';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import CooldownThroughputTracker from './modules/features/CooldownThroughputTracker';
import EagletalonsTrueFocus from './modules/talents/EagletalonsTrueFocus';
import SerpentstalkersTrickery from './modules/talents/SerpentstalkersTrickery';
import SurgingShots from './modules/talents/SurgingShots';
import Focus from './modules/resources/Focus';
import MarksmanshipFocusCapTracker from './modules/resources/MarksmanshipFocusCapTracker';
import MarksmanshipFocusUsage from './modules/resources/MarksmanshipFocusUsage';
import AimedShot from './modules/talents/AimedShot';
import LoneWolf from './modules/spells/LoneWolf';
import PreciseShots from './modules/spells/PreciseShots';
import RapidFire from './modules/spells/RapidFire';
import SteadyShot from './modules/spells/SteadyShot';
import Trueshot from './modules/spells/Trueshot';
import CallingTheShots from './modules/talents/CallingTheShots';
import CarefulAim from './modules/talents/CarefulAim';
import ChimaeraShot from './modules/talents/ChimaeraShot';
import ExplosiveShot from '../shared/talents/ExplosiveShot';
import LockAndLoad from './modules/talents/LockAndLoad';
import MasterMarksman from '../shared/talents/MasterMarksman';
import SerpentSting from '../shared/talents/SerpentSting';
import SteadyFocus from './modules/talents/SteadyFocus';
import Streamline from './modules/talents/Streamline';
import Volley from './modules/talents/Volley';
import AimedShotPrepullNormalizer from './normalizers/AimedShotPrepullNormalizer';
import Deathblow from './modules/talents/Deathblow';

import BlackArrow from '../shared/talents/hero/darkranger/BlackArrow';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Core statistics
    abilities: Abilities,
    channeling: Channeling,
    globalCooldown: GlobalCooldown,
    spellUsable: SpellUsable,
    checklist: Checklist,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    cooldownThroughputTracker: CooldownThroughputTracker,
    cancelledCasts: CancelledCasts,
    buffs: Buffs,

    //Resources
    focusTracker: FocusTracker,
    focusDetails: FocusDetails,
    spellFocusCost: SpellFocusCost,
    marksmanshipFocusCapTracker: MarksmanshipFocusCapTracker,
    focus: Focus,
    marksmanshipFocusUsage: MarksmanshipFocusUsage,

    //Normalizers
    aimedShotPrepullNormalizer: AimedShotPrepullNormalizer,
    wailingArrowPrepullNormalizer: WailingArrowPrepullNormalizer,

    //DeathTracker
    deathTracker: DeathTracker,

    //Spells
    trueshot: Trueshot,
    loneWolf: LoneWolf,
    preciseShots: PreciseShots,
    rapidFire: RapidFire,
    steadyShot: SteadyShot,
    killShot: KillShot,
    bindingShot: BindingShot,

    //Talents
    aimedShot: AimedShot,
    volley: Volley,
    lockAndLoad: LockAndLoad,
    callingTheShots: CallingTheShots,
    steadyFocus: SteadyFocus,
    carefulAim: CarefulAim,
    chimaeraShot: ChimaeraShot,
    streamline: Streamline,
    deathblow: Deathblow,
    surgingShots: SurgingShots,
    serpentstalkersTrickery: SerpentstalkersTrickery,
    eagletalonsTrueFocus: EagletalonsTrueFocus,

    //Shared Talents
    rejuvenatingWind: RejuvenatingWind,
    deathChakrams: DeathChakrams,
    tranquilizingShot: TranquilizingShot,
    trailblazer: Trailblazer,
    naturalMending: NaturalMending,
    bornToBeWild: BornToBeWild,
    aMurderOfCrows: AMurderOfCrows,
    explosiveShot: ExplosiveShot,
    masterMarksman: MasterMarksman,
    wailingArrow: WailingArrow,
    steelTrap: SteelTrap,
    serpentSting: SerpentSting,
    barrage: Barrage,

    // items
    // t292p: T29MMTier2P,
    // t294p: T29MMTier4P,

    // Hero Talents
    blackarrow: BlackArrow,

    // There's no throughput benefit from casting Arcane Torrent on cooldown
    arcaneTorrent: [ArcaneTorrent, { castEfficiency: null }] as const,
  };
}

export default CombatLogParser;
