import PreparationRuleAnalyzer from 'parser/shadowlands/modules/features/Checklist/PreparationRuleAnalyzer';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import BaseChecklist from 'parser/shared/modules/features/Checklist/Module';

import BeaconUptime from '../beacons/BeaconUptime';
import DirectBeaconHealing from '../beacons/DirectBeaconHealing';
import AlwaysBeCasting from '../features/AlwaysBeCasting';
import MasteryEffectiveness from '../features/MasteryEffectiveness';
import FillerFlashOfLight from '../spells/FillerFlashOfLight';
import FillerLightOfTheMartyrs from '../spells/FillerLightOfTheMartyrs';
import Component from './Component';

class Checklist extends BaseChecklist {
  static dependencies = {
    ...BaseChecklist.dependencies,
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    masteryEffectiveness: MasteryEffectiveness,
    alwaysBeCasting: AlwaysBeCasting,
    directBeaconHealing: DirectBeaconHealing,
    beaconUptime: BeaconUptime,
    fillerLightOfTheMartyrs: FillerLightOfTheMartyrs,
    fillerFlashOfLight: FillerFlashOfLight,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
  };

  protected combatants!: Combatants;
  protected castEfficiency!: CastEfficiency;
  protected masteryEffectiveness!: MasteryEffectiveness;
  protected alwaysBeCasting!: AlwaysBeCasting;
  protected directBeaconHealing!: DirectBeaconHealing;
  protected beaconUptime!: BeaconUptime;
  protected fillerLightOfTheMartyrs!: FillerLightOfTheMartyrs;
  protected fillerFlashOfLight!: FillerFlashOfLight;
  protected preparationRuleAnalyzer!: PreparationRuleAnalyzer;

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        owner={this.owner}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          fillerFlashOfLight: this.fillerFlashOfLight.suggestionThresholds,
          masteryEffectiveness: this.masteryEffectiveness.suggestionThresholds,
          nonHealingTimeSuggestionThresholds: this.alwaysBeCasting
            .nonHealingTimeSuggestionThresholds,
          downtimeSuggestionThresholds: this.alwaysBeCasting.downtimeSuggestionThresholds,
          directBeaconHealing: this.directBeaconHealing.suggestionThresholds,
          beaconUptimeBoL: this.beaconUptime.suggestionThresholdsBoL,
          beaconUptimeBoLUptime: this.beaconUptime.suggestionThresholdsBoLUptime,
          beaconUptimeBoF: this.beaconUptime.suggestionThresholdsBoF,
          beaconUptimeBoFUptime: this.beaconUptime.suggestionThresholdsBoFUptime,
          fillerLightOfTheMartyrsCpm: this.fillerLightOfTheMartyrs.cpmSuggestionThresholds,
          fillerLightOfTheMartyrsInefficientCpm: this.fillerLightOfTheMartyrs
            .inefficientCpmSuggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
