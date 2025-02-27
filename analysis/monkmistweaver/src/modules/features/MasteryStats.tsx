import { formatThousands } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import DonutChart from 'parser/ui/DonutChart';
import Statistic from 'parser/ui/Statistic';
import { STATISTIC_ORDER } from 'parser/ui/StatisticsListBox';

import { SPELL_COLORS } from '../../constants';
import EnvelopingMists from '../spells/EnvelopingMists';
import EssenceFont from '../spells/EssenceFont';
import ExpelHarm from '../spells/ExpelHarm';
import RenewingMist from '../spells/RenewingMist';
import Revival from '../spells/Revival';
import SoothingMist from '../spells/SoothingMist';
import Vivify from '../spells/Vivify';

class MasteryStats extends Analyzer {
  static dependencies = {
    essenceFont: EssenceFont,
    envelopingMists: EnvelopingMists,
    soothingMist: SoothingMist,
    renewingMist: RenewingMist,
    vivify: Vivify,
    expelHarm: ExpelHarm,
    revival: Revival,
  };

  protected essenceFont!: EssenceFont;
  protected envelopingMists!: EnvelopingMists;
  protected soothingMist!: SoothingMist;
  protected renewingMist!: RenewingMist;
  protected vivify!: Vivify;
  protected expelHarm!: ExpelHarm;
  protected revival!: Revival;

  get totalMasteryHealing() {
    return (
      (this.vivify.gomHealing || 0) +
      (this.renewingMist.gustsHealing || 0) +
      (this.envelopingMists.gustsHealing || 0) +
      (this.soothingMist.gustsHealing || 0) +
      (this.essenceFont.gomHealing || 0) +
      (this.expelHarm.gustsHealing || 0) +
      this.revival.gustsHealing
    );
  }

  renderMasterySourceChart() {
    const items = [
      {
        color: SPELL_COLORS.VIVIFY,
        label: 'Vivify',
        spellId: SPELLS.VIVIFY.id,
        value: this.vivify.gomHealing,
        valueTooltip: formatThousands(this.vivify.gomHealing),
      },
      {
        color: SPELL_COLORS.RENEWING_MIST,
        label: 'Renewing Mist',
        spellId: SPELLS.RENEWING_MIST.id,
        value: this.renewingMist.gustsHealing,
        valueTooltip: formatThousands(this.renewingMist.gustsHealing),
      },
      {
        color: SPELL_COLORS.ENVELOPING_MIST,
        label: 'Enveloping Mist',
        spellId: SPELLS.ENVELOPING_MIST.id,
        value: this.envelopingMists.gustsHealing,
        valueTooltip: formatThousands(this.envelopingMists.gustsHealing),
      },
      {
        color: SPELL_COLORS.SOOTHING_MIST,
        label: 'Soothing Mist',
        spellId: SPELLS.SOOTHING_MIST.id,
        value: this.soothingMist.gustsHealing,
        valueTooltip: formatThousands(this.soothingMist.gustsHealing),
      },
      {
        color: SPELL_COLORS.ESSENCE_FONT,
        label: 'Essence font',
        spellId: SPELLS.ESSENCE_FONT.id,
        value: this.essenceFont.gomHealing,
        valueTooltip: formatThousands(this.essenceFont.gomHealing),
      },
      {
        color: SPELL_COLORS.EXPEL_HARM,
        label: 'Expel Harm',
        spellId: SPELLS.EXPEL_HARM.id,
        value: this.expelHarm.gustsHealing,
        valueTooltip: formatThousands(this.expelHarm.gustsHealing),
      },
      {
        color: SPELL_COLORS.REVIVAL,
        label: 'Revival',
        spellId: SPELLS.REVIVAL.id,
        value: this.revival.gustsHealing,
        valueTooltip: formatThousands(this.revival.gustsHealing),
      },
    ];

    return <DonutChart items={items} />;
  }

  statistic() {
    return (
      <Statistic position={STATISTIC_ORDER.CORE(20)} size="flexible">
        <div className="pad">
          <label>
            <SpellLink id={SPELLS.GUSTS_OF_MISTS.id}>Gusts of Mists</SpellLink> breakdown
          </label>
          {this.renderMasterySourceChart()}
        </div>
      </Statistic>
    );
  }
}

export default MasteryStats;
