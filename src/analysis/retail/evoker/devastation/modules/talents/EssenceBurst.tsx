import SPELLS from 'common/SPELLS';
import { TALENTS_EVOKER } from 'common/TALENTS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, {
  ChangeBuffStackEvent,
  GlobalCooldownEvent,
  RefreshBuffEvent,
} from 'parser/core/Events';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

const LAG_BUFFER_MS = 100;

class EssenceBurstDevastation extends Analyzer {
  // static dependencies = {
  //   abilityTracker: AbilityTracker,
  // };
  // protected abilityTracker!: AbilityTracker;

  lastGCDTime: number = 0;
  lastGCDDuration: number = 0;

  essenceBurstProcs: number = 0;
  wastedEssenceBurstProcs: number = 0;

  maxEssenceBurstStacks: number = 1;

  constructor(options: Options) {
    super(options);

    this.maxEssenceBurstStacks = this.selectedCombatant.hasTalent(
      TALENTS_EVOKER.ESSENCE_ATTUNEMENT_TALENT,
    )
      ? 2
      : 1;

    this.addEventListener(Events.GlobalCooldown, this.globalCooldown);
    this.addEventListener(
      Events.changebuffstack.by(SELECTED_PLAYER).spell(SPELLS.ESSENCE_BURST_DEVASTATION_BUFF),
      this.onEssenceBurstStackChange,
    );
    this.addEventListener(
      Events.refreshbuff.by(SELECTED_PLAYER).spell(SPELLS.ESSENCE_BURST_DEVASTATION_BUFF),
      this.onBuffRefresh,
    );
  }

  globalCooldown(event: GlobalCooldownEvent) {
    this.lastGCDTime = event.timestamp;
    this.lastGCDDuration = event.duration;
  }

  onEssenceBurstStackChange(event: ChangeBuffStackEvent) {
    const stackChange = event.stacksGained;
    if (stackChange > 0) {
      this.essenceBurstProcs += stackChange;
    }

    // if (stackChange === -1) { // buff expired without usage therefore it was wasted
    //   this.wastedEssenceBurstProcs += 1;
    // }
  }

  onBuffRefresh(event: RefreshBuffEvent) {
    const timeSinceGCD = event.timestamp - this.lastGCDTime;
    if (timeSinceGCD < this.lastGCDDuration + LAG_BUFFER_MS) {
      return;
    }
    this.wastedEssenceBurstProcs += 1;
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        position={STATISTIC_ORDER.CORE(1)}
        category={STATISTIC_CATEGORY.TALENTS}
      >
        <BoringSpellValueText spellId={SPELLS.ESSENCE_BURST_DEVASTATION_BUFF.id}>
          <span>{this.essenceBurstProcs}</span>
          <br />
          <span>{this.wastedEssenceBurstProcs}</span>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default EssenceBurstDevastation;
