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
    </Section>
  );
}
