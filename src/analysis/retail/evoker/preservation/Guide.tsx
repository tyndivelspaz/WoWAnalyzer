import { GuideProps } from 'interface/guide';
import PreparationSection from 'interface/guide/components/Preparation/PreparationSection';
import CombatLogParser from 'parser/core/CombatLogParser';
import { BigBlossom } from './modules/guide/BigBlossom';
import { UnlimitedReversion } from './modules/guide/UnlimitedReversion';

export default function Guide({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <>
      <UnlimitedReversion modules={modules} info={info} events={events} />
      <BigBlossom modules={modules} info={info} events={events} />
      <PreparationSection />
    </>
  );
}
