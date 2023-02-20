import { TALENTS_EVOKER } from 'common/TALENTS';
import { GuideProps, Section } from 'interface/guide';
import CombatLogParser from 'parser/core/CombatLogParser';

import CastEfficiencyBar from 'parser/ui/CastEfficiencyBar';
import { GapHighlight } from 'parser/ui/CooldownBar';

export function UnlimitedReversion({ events, info, modules }: GuideProps<typeof CombatLogParser>) {
  return (
    <Section title="Unlimited HoTs">
      <p>
        This section is relevant if you are running a variant of the 'Unlimited HoTs' talent build.
      </p>
      <CastEfficiencyBar
        spellId={TALENTS_EVOKER.REVERSION_TALENT.id}
        gapHighlightMode={GapHighlight.FullCooldown}
      />
    </Section>
  );
}
