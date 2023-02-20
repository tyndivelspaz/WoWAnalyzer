import { Section } from 'interface/guide';

export function IntroSection() {
  return (
    <Section title="Preface">
      <p>
        Hello and welcome to the analyzer for the Preservation Evoker spec! All the theorycrafting
        comes from summarizing the guides over at{' '}
        <a href="https://www.wowhead.com/guide/classes/evoker/preservation/overview-pve-healer">
          Wowhead
        </a>
        ,{' '}
        <a href="https://www.icy-veins.com/wow/preservation-evoker-pve-healing-guide">Icy Veins</a>,{' '}
        <a href="https://discord.com/invite/evoker">Evoker Discord</a>.
      </p>
      <p>
        The accuracy and problems pointed out here are <b>guidelines</b> and don't factor in raid
        conditions or edge cases. To find a good measure of success, you should compare your results
        to other top Evokers in the same fight with Warcraft Logs (e.g{' '}
        <a href="https://www.warcraftlogs.com/zone/rankings/31#boss=2639&difficulty=4&class=Evoker&spec=Preservation">
          Heroic Terros Top 100
        </a>
        ).
      </p>
    </Section>
  );
}
