import { change, date } from 'common/changelog';
import { Sharrq, Tyndi, Zeboot } from 'CONTRIBUTORS';

export default [
  change(date(2022, 3, 12), 'Converted to Demonology Warlock to TypeScript', Tyndi),
  change(date(2020, 10, 18), 'Converted legacy listeners to new event filters', Zeboot),
  change(date(2020, 10, 15), 'Updated Spellbook and added Conduit, Legendary, and Covenant Spell IDs', Sharrq),
  change(date(2020, 10, 2), 'Deleted Azerite Traits, Updated Statistic Boxes and added Integration Tests.', Sharrq),
];
