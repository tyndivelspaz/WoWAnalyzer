import { formatThousands } from 'common/format';
import SPELLS from 'common/SPELLS';
import { Talent } from 'common/TALENTS/types';
import { TALENTS_MONK } from 'common/TALENTS';
import { SpellLink } from 'interface';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { CastEvent, HealEvent } from 'parser/core/Events';
import DonutChart from 'parser/ui/DonutChart';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import { LESSONS_BUFFS, SPELL_COLORS } from '../../constants';
import UpliftedSpirits from './UpliftedSpirits';
import { isFromRevival } from '../../normalizers/CastLinkNormalizer';
import { explanationAndDataSubsection } from 'interface/guide/components/ExplanationRow';
import EssenceFont from './EssenceFont';
import { getLowestPerf, QualitativePerformance } from 'parser/ui/QualitativePerformance';
import CooldownExpandable, {
  CooldownExpandableItem,
} from 'interface/guide/components/CooldownExpandable';
import { PerformanceMark } from 'interface/guide';

interface RevivalCastTracker {
  timeStamp: number; // time of cast
  lessonsBuffActive: boolean; // was SG pre cast
  numEfHots: number; // number of ef hots on the raid prior to casting
}

class Revival extends Analyzer {
  static dependencies = {
    upliftedSpirits: UpliftedSpirits,
    essenceFont: EssenceFont,
  };

  protected upliftedSpirits!: UpliftedSpirits;
  protected essenceFont!: EssenceFont;
  castTracker: RevivalCastTracker[] = [];

  activeTalent!: Talent;
  revivalDirectHealing: number = 0;
  revivalDirectOverHealing: number = 0;

  gustsHealing: number = 0;
  gustOverHealing: number = 0;
  minEfHotsBeforeCast: number = 0;

  constructor(options: Options) {
    super(options);
    this.active =
      this.selectedCombatant.hasTalent(TALENTS_MONK.RESTORAL_TALENT) ||
      this.selectedCombatant.hasTalent(TALENTS_MONK.REVIVAL_TALENT);

    if (!this.active) {
      return;
    }
    this.activeTalent = this.getRevivalTalent();
    this.addEventListener(
      Events.cast
        .by(SELECTED_PLAYER)
        .spell([TALENTS_MONK.REVIVAL_TALENT, TALENTS_MONK.RESTORAL_TALENT]),
      this.handleCast,
    );
    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(TALENTS_MONK.REVIVAL_TALENT),
      this.handleRevivalDirect,
    );

    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(TALENTS_MONK.RESTORAL_TALENT),
      this.handleRevivalDirect,
    );

    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(SPELLS.GUSTS_OF_MISTS),
      this.handleGustsOfMists,
    );
    this.minEfHotsBeforeCast =
      10 + 6 * this.selectedCombatant.getTalentRank(TALENTS_MONK.UPWELLING_TALENT);
  }

  getRevivalTalent() {
    return this.selectedCombatant.hasTalent(TALENTS_MONK.RESTORAL_TALENT)
      ? TALENTS_MONK.RESTORAL_TALENT
      : TALENTS_MONK.REVIVAL_TALENT;
  }

  handleCast(event: CastEvent) {
    this.castTracker.push({
      timeStamp: event.timestamp,
      lessonsBuffActive: LESSONS_BUFFS.some((buff) => this.selectedCombatant.hasBuff(buff.id)),
      numEfHots: this.essenceFont.curBuffs,
    });
  }

  handleRevivalDirect(event: HealEvent) {
    this.revivalDirectHealing += event.amount + (event.absorbed || 0);
    this.revivalDirectOverHealing += event.overheal || 0;
  }

  handleGustsOfMists(event: HealEvent) {
    if (isFromRevival(event)) {
      this.gustsHealing += event.amount + (event.absorbed || 0);
      this.gustOverHealing += event.overheal || 0;
    }
  }

  renderRevivalChart() {
    const items = [
      {
        color: SPELL_COLORS.REVIVAL,
        label: this.activeTalent.name,
        spellId: this.activeTalent.id,
        value: this.revivalDirectHealing,
        valueTooltip: formatThousands(this.revivalDirectHealing),
      },
      {
        color: SPELL_COLORS.GUSTS_OF_MISTS,
        label: 'Gust Of Mist',
        spellId: SPELLS.GUSTS_OF_MISTS.id,
        value: this.gustsHealing,
        valueTooltip: formatThousands(this.gustsHealing),
      },
    ];

    if (this.selectedCombatant.hasTalent(TALENTS_MONK.UPLIFTED_SPIRITS_TALENT)) {
      items.push({
        color: SPELL_COLORS.UPLIFTED_SPIRITS,
        label: 'Uplifted Spirits',
        spellId: TALENTS_MONK.UPLIFTED_SPIRITS_TALENT.id,
        value: this.upliftedSpirits.usHealing,
        valueTooltip: formatThousands(this.upliftedSpirits.usHealing),
      });
    }

    return <DonutChart items={items} />;
  }

  get guideCastBreakdown() {
    const explanationPercent = 55;
    const explanation = (
      <p>
        <strong>
          <SpellLink id={this.getRevivalTalent()} />
        </strong>{' '}
        is a fairly straightforward cooldown, however there are a few things you should always aim
        to do prior to casting it to maximize its healing. Always pre-cast{' '}
        <SpellLink id={TALENTS_MONK.ESSENCE_FONT_TALENT} /> to get as many duplicated{' '}
        <SpellLink id={SPELLS.GUSTS_OF_MISTS} /> heals as possible. If talented into{' '}
        <SpellLink id={TALENTS_MONK.SHAOHAOS_LESSONS_TALENT} />, always pre-cast{' '}
        <SpellLink id={TALENTS_MONK.SHEILUNS_GIFT_TALENT} /> the global before so that your cast
        receives the benefit of the buff.
      </p>
    );
    const data = (
      <div>
        <strong>Per-Cast Breakdown</strong>
        <small> - click to expand</small>
        {this.castTracker.map((cast, idx) => {
          const header = (
            <>
              @ {this.owner.formatTimestamp(cast.timeStamp)} &mdash;{' '}
              <SpellLink id={this.getRevivalTalent()} />
            </>
          );
          const checklistItems: CooldownExpandableItem[] = [];
          let efPerf = QualitativePerformance.Good;
          if (cast.numEfHots < Math.floor(this.minEfHotsBeforeCast * 0.75)) {
            efPerf = QualitativePerformance.Fail;
          } else if (cast.numEfHots < Math.floor(this.minEfHotsBeforeCast * 0.9)) {
            efPerf = QualitativePerformance.Ok;
          }
          checklistItems.push({
            label: (
              <>
                <SpellLink id={TALENTS_MONK.ESSENCE_FONT_TALENT} /> HoTs active on cast
              </>
            ),
            result: <PerformanceMark perf={efPerf} />,
            details: <>{cast.numEfHots}</>,
          });
          const allPerfs = [efPerf];
          if (this.selectedCombatant.hasTalent(TALENTS_MONK.SHAOHAOS_LESSONS_TALENT)) {
            let lessonPerf = QualitativePerformance.Good;
            if (!cast.lessonsBuffActive) {
              lessonPerf = QualitativePerformance.Fail;
            }
            checklistItems.push({
              label: (
                <>
                  <SpellLink id={TALENTS_MONK.SHAOHAOS_LESSONS_TALENT} /> buff active
                </>
              ),
              result: <PerformanceMark perf={lessonPerf} />,
              details: <>{cast.lessonsBuffActive ? <>Yes</> : <>No</>}</>,
            });
            allPerfs.push(lessonPerf);
          }
          const averagePerf = getLowestPerf(allPerfs);
          return (
            <CooldownExpandable
              header={header}
              checklistItems={checklistItems}
              perf={averagePerf}
              key={idx}
            />
          );
        })}
      </div>
    );
    return explanationAndDataSubsection(explanation, data, explanationPercent);
  }

  statistic() {
    return (
      <Statistic position={STATISTIC_ORDER.CORE(3)} size="flexible">
        <div className="pad">
          <label>
            <SpellLink id={this.activeTalent.id}>{this.activeTalent.name}</SpellLink> breakdown
          </label>
          {this.renderRevivalChart()}
        </div>
      </Statistic>
    );
  }
}

export default Revival;
