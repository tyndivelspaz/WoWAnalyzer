import { DamageEvent } from 'parser/core/Events';

/**
 * This should honestly be done away with but there are so many unique Events/Sub-Events that call the calculateEffectiveHealing fucntions
 * that this is just easier to do than go modify all the callers.
 */
type LightWeightHealingEvent = {
  amount: number;
  absorbed?: number;
  overheal?: number;
};

/**
 * Calculates the effective healing attributable to a percent healing buff.
 * The bonus healing is considered 'marginal' and will be consumed first when encountering overheal.
 *
 * For example, consider an effect that boosts healing by 20%, and we want to attribute healing caused by the effect.
 * We pass an event with raw healing of 1200 and 0 overheal, and we pass the relativeHealIncrease which is 0.20.
 * The function would calculate 1000 as the healing without the boost so 1200 - 1000 = 200 healing attributable.
 *
 * We consider the boosted healing to be the 'last' healing applied, so it is the first thing to be subtracted if we overheal.
 * For example, if the 1200 heal was 1150 effective and 50 overheal, we would attribute 200 - 50 = 150 healing attributable.
 * If the 1200 heal was 900 effective and 300 overheal, all of the bonus was overheal and so 0 healing is attributable.
 *
 * @param event a healing event (or heal-like event) that was boosted by an effect
 * @param relativeHealIncrease the boost's added multiplier (for +20% pass 0.20)
 * @return the amount of healing attributable on the given heal from the given boost
 */
export function calculateEffectiveHealing(
  event: LightWeightHealingEvent,
  relativeHealIncrease: number,
): number {
  const amount = event.amount;
  const absorbed = event.absorbed || 0;
  const overheal = event.overheal || 0;
  const raw = amount + absorbed + overheal;
  const relativeHealingIncreaseFactor = 1 + relativeHealIncrease;
  const healingIncrease = raw - raw / relativeHealingIncreaseFactor;
  const effectiveHealing = healingIncrease - overheal;

  return Math.max(0, effectiveHealing);
}

/**
 * Calculates the effective healing attributable to the *last stack* of a stacking percent healing buff.
 * See `calculateEffectiveHealing` first for more info on the calculation and how overheal is handled.
 *
 * This can be useful for calculating the marginal benefit of 'one more point' in something.
 * For example, consider an effect that grants +10% healing per point, and the player has 4 points.
 * We can't consider the boost from the 4th point to be another +10% because it stacks additively with the previous +30%,
 * so for a 1400 heal the calculation would be 1300 from base heal + 30%, 100 attributable from extra +10%.
 * If we had considered the +10% in a vacuum the calculation would have been 1400 - (1400 / 1.1) = 127.
 *
 * @param event a healing event (or heal-like event) that was boosted by an effect
 * @param relativeHealIncreasePerStack the boost's added multiplier per stack (for +10% pass 0.10)
 * @param stacks the number of stacks active, *including the marginal stack we're calculating for*
 *   (so in the above example we'd pass 4)
 * @return the amount of healing attributable on the given heal from the last stack of the given boost
 */
export function calculateEffectiveHealingStacked(
  event: LightWeightHealingEvent,
  relativeHealIncreasePerStack: number,
  stacks: number,
): number {
  const amount = event.amount;
  const absorbed = event.absorbed || 0;
  const overheal = event.overheal || 0;
  const raw = amount + absorbed + overheal;
  const relativeHealingIncreaseFactor = 1 + relativeHealIncreasePerStack * stacks;
  const totalHealingIncrease = raw - raw / relativeHealingIncreaseFactor;
  const oneStackHealingIncrease = totalHealingIncrease / stacks;
  const effectiveHealing = oneStackHealingIncrease - overheal;

  return Math.max(0, effectiveHealing);
}

/**
 * Gets raw max casts of a spell over a period of time.
 * @param cooldown the cooldown time of the spell, in seconds
 * @param duration the duration of the time period to assess, in milliseconds
 * @param charges the number of charges the spell has
 */
export function calculateMaxCasts(cooldown: number, duration: number, charges = 1) {
  return duration / 1000 / cooldown + charges - 1;
}

/**
 * Calculates the effective damage attributable to the *last stack* of a stacking percent damage buff.
 *
 * This can be useful for calculating the marginal benefit of 'one more point' in something.
 * For example, consider an effect that grants +10% damage per point, and the player has 4 points.
 * We can't consider the boost from the 4th point to be another +10% because it stacks additively with the previous +30%,
 * so for a 1400 damage the calculation would be 1300 from base damage + 30%, 100 attributable from extra +10%.
 * If we had considered the +10% in a vacuum the calculation would have been 1400 - (1400 / 1.1) = 127.
 *
 * @param event a damage event that was boosted by an effect
 * @param increase the boost's added multiplier per stack (for +10% pass 0.10)
 * @param stacks the number of stacks active, *including the marginal stack we're calculating for*
 *   (so in the above example we'd pass 4)
 * @return the amount of damage attributable on the given damage event from the last stack of the given boost
 */
export function calculateEffectiveDamageStacked(
  event: DamageEvent,
  increase: number,
  stacks: number,
): number {
  const raw = (event.amount || 0) + (event.absorbed || 0);
  const relativeDamageIncreaseFactor = 1 + increase * stacks;
  const totalIncrease = raw - raw / relativeDamageIncreaseFactor;
  const oneStackIncrease = totalIncrease / stacks;

  return Math.max(0, oneStackIncrease);
}

export function calculateEffectiveDamageReduction(event: DamageEvent, reduction: number) {
  const raw = (event.amount || 0) + (event.absorbed || 0);
  return (raw / (1 - reduction)) * reduction;
}

/**
 * Calculates the effective damage attributable to a percent damage buff.
 *
 * For example, consider an effect that boosts damage by 20%, and we want to attribute damage caused by the effect.
 * We pass an event with raw damage of 1200, and we pass the increase which is 0.20.
 * The function would calculate 1000 as the damage without the boost so 1200 - 1000 = 200 damage attributable.
 *
 * @param event a damage event that was boosted by an effect
 * @param increase the boost's added multiplier (for +20% pass 0.20)
 * @return the amount of damage attributable on the given damage event from the given boost
 */
export function calculateEffectiveDamage(event: DamageEvent, increase: number): number {
  const raw = (event.amount || 0) + (event.absorbed || 0);
  return raw - raw / (1 + increase);
}
