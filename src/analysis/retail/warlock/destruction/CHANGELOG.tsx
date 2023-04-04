import { change, date } from 'common/changelog';
import SPELLS from 'common/SPELLS';
import { Sharrq, ogunb, ToppleTheNun, Omegabiscuit, Mae, dodse} from 'CONTRIBUTORS';
import { SpellLink } from 'interface';

// prettier-ignore
export default [
  change(date(2023, 3, 9), "Update Soul Conduit to take into account being a 2 rank talent and different scaling", dodse),
  change(date(2023, 3, 5), "Update Havoc module to also work with Mayhem and try to identify damage from Havoc more accurately.", dodse),
  change(date(2023, 3, 5), "Update Madness module to track buffed RoF and Shadowburn.", dodse),
  change(date(2023, 3, 5), "Add Burn to Ashes buffed Incinerates statistic.", dodse),
  change(date(2023, 1, 17), "Add more data to Backdraft and Roaring Blaze analyzers. Add Flashpoint analyzer.", Mae),
  change(date(2023, 1, 17), "Add Madness of Azh'aqir analyzer", Mae),
  change(date(2023, 1, 16), 'Add Rolling Havoc analyzer', Mae),
  change(date(2022, 10, 31), 'Update to reflect that Destruction Warlock has been looked at for Dragonflight.', ToppleTheNun),
  change(date(2022, 10, 15), 'updated spells that were converted to talents to use talents list', Omegabiscuit),
  change(date(2022, 7, 22), <>Add tracker for number of <SpellLink id={SPELLS.DEMONIC_CIRCLE_SUMMON.id} /> created.</>, ToppleTheNun),
  change(date(2020, 6, 25), 'Updated Destruction to Typescript.', ogunb),
  change(date(2020, 10, 15), 'Updated Spellbook and added Conduit, Legendary, and Covenant Spell IDs', Sharrq),
  change(date(2020, 10, 2), 'Deleted Azerite Traits, Updated Statistic Boxes and added Integration Tests.', Sharrq),
];
