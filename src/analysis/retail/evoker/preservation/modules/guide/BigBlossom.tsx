import { GuideProps, Section, useAnalyzer } from 'interface/guide';
import CombatLogParser from 'parser/core/CombatLogParser';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';

export function BigBlossom({ events, info, modules }: GuideProps<typeof CombatLogParser>) {
  const castEfficiency = useAnalyzer(CastEfficiency);
  if (!info || !castEfficiency) {
    return null;
  }
  return (
    <Section title="Big Blossoms">
      <p>
        This section is relevant if you are running a variant of the 'Big Blossom' talent build.
      </p>
    </Section>
  );
}
