import { BermudaDefaults } from '../constants';

/**
 * MeetingCostCalculator
 * Calculates meeting costs using employee costs and duration
 * Handles real-time tracking and milestone detection
 */

class MeetingCostCalculator {
  /**
   * Calculate pre-meeting cost (before meeting starts)
   * @param {array} attendees - Array of employees attending
   * @param {number} durationMinutes - Scheduled duration in minutes
   * @returns {object} Cost breakdown with milestones
   */
  calculatePreMeetingCost(attendees, durationMinutes) {
    // Sum of all attendee per-minute costs
    const totalPerMinuteCost = attendees.reduce((sum, attendee) => {
      return sum + (attendee.perMinuteCost || 0);
    }, 0);

    // Total cost if meeting runs full duration
    const totalCost = totalPerMinuteCost * durationMinutes;

    // Calculate costs at each milestone
    const milestones = this._calculateMilestoneCosts(totalPerMinuteCost, durationMinutes);

    // Calculate per-attendee costs for this duration
    const attendeeCosts = attendees.map(attendee => ({
      ...attendee,
      cost: this._round2((attendee.perMinuteCost || 0) * durationMinutes),
    }));

    return {
      attendeeCount: attendees.length,
      totalPerMinuteCost: this._round3(totalPerMinuteCost),
      durationMinutes,
      totalCost: this._round2(totalCost),
      milestones,
      attendeeCosts,
    };
  }

  /**
   * Calculate real-time meeting cost
   * @param {array} attendees - Array of employees attending
   * @param {number} elapsedMinutes - Minutes elapsed so far
   * @returns {object} Current cost and next milestone info
   */
  calculateRealTimeCost(attendees, elapsedMinutes) {
    // Sum of all attendee per-minute costs
    const totalPerMinuteCost = attendees.reduce((sum, attendee) => {
      return sum + (attendee.perMinuteCost || 0);
    }, 0);

    // Current accumulated cost
    const currentCost = totalPerMinuteCost * elapsedMinutes;

    // Milestones reached so far
    const milestonesReached = this._getMilestonesReached(elapsedMinutes);

    // Next milestone
    const nextMilestone = this._getNextMilestone(elapsedMinutes);
    const nextMilestoneCost = nextMilestone
      ? totalPerMinuteCost * nextMilestone
      : null;

    // Calculate per-attendee costs
    const attendeeCosts = attendees.map(attendee => ({
      ...attendee,
      currentCost: this._round2((attendee.perMinuteCost || 0) * elapsedMinutes),
    }));

    return {
      currentCost: this._round2(currentCost),
      totalPerMinuteCost: this._round3(totalPerMinuteCost),
      elapsedMinutes,
      milestonesReached,
      nextMilestone,
      nextMilestoneCost: nextMilestoneCost ? this._round2(nextMilestoneCost) : null,
      minutesToNextMilestone: nextMilestone ? nextMilestone - elapsedMinutes : null,
      attendeeCosts,
    };
  }

  /**
   * Calculate final meeting cost (when meeting ends)
   * @param {array} attendees - Array of employees who attended
   * @param {number} actualMinutes - Actual duration in minutes
   * @param {number} scheduledMinutes - Scheduled duration in minutes
   * @returns {object} Final cost breakdown with comparison
   */
  calculateFinalCost(attendees, actualMinutes, scheduledMinutes) {
    const totalPerMinuteCost = attendees.reduce((sum, attendee) => {
      return sum + (attendee.perMinuteCost || 0);
    }, 0);

    const actualCost = totalPerMinuteCost * actualMinutes;
    const scheduledCost = totalPerMinuteCost * scheduledMinutes;
    const costDifference = actualCost - scheduledCost;

    // All milestones reached during meeting
    const allMilestones = this._calculateMilestoneCosts(totalPerMinuteCost, actualMinutes);

    // Calculate per-attendee final costs
    const attendeeCosts = attendees.map(attendee => ({
      ...attendee,
      finalCost: this._round2((attendee.perMinuteCost || 0) * actualMinutes),
      percentageOfTotal: this._round2(((attendee.perMinuteCost || 0) / totalPerMinuteCost) * 100),
    }));

    return {
      actualCost: this._round2(actualCost),
      scheduledCost: this._round2(scheduledCost),
      costDifference: this._round2(costDifference),
      ranOver: actualMinutes > scheduledMinutes,
      endedEarly: actualMinutes < scheduledMinutes,
      actualMinutes,
      scheduledMinutes,
      minutesDifference: actualMinutes - scheduledMinutes,
      attendeeCosts,
      milestones: allMilestones,
      costPerMinute: this._round3(totalPerMinuteCost),
    };
  }

  /**
   * Calculate milestone costs
   * @param {number} perMinuteCost - Total per-minute cost for all attendees
   * @param {number} maxMinutes - Maximum duration to calculate
   * @returns {array} Milestone objects with time and cost
   */
  _calculateMilestoneCosts(perMinuteCost, maxMinutes) {
    const milestones = [];
    const baseMilestones = BermudaDefaults.milestones;

    // Add all base milestones that fall within duration
    baseMilestones.forEach(minutes => {
      if (minutes <= maxMinutes) {
        milestones.push({
          timeMinutes: minutes,
          cost: this._round2(perMinuteCost * minutes),
        });
      }
    });

    // Continue pattern at 15-minute intervals beyond 120 if needed
    if (maxMinutes > 120) {
      let currentMilestone = 120 + BermudaDefaults.milestoneInterval;
      while (currentMilestone <= maxMinutes) {
        milestones.push({
          timeMinutes: currentMilestone,
          cost: this._round2(perMinuteCost * currentMilestone),
        });
        currentMilestone += BermudaDefaults.milestoneInterval;
      }
    }

    return milestones;
  }

  /**
   * Get milestones that have been reached
   */
  _getMilestonesReached(elapsedMinutes) {
    const milestones = [];
    const baseMilestones = BermudaDefaults.milestones;

    // Check base milestones
    baseMilestones.forEach(minutes => {
      if (minutes <= elapsedMinutes) {
        milestones.push(minutes);
      }
    });

    // Check extended milestones if past 120
    if (elapsedMinutes > 120) {
      let currentMilestone = 120 + BermudaDefaults.milestoneInterval;
      while (currentMilestone <= elapsedMinutes) {
        milestones.push(currentMilestone);
        currentMilestone += BermudaDefaults.milestoneInterval;
      }
    }

    return milestones;
  }

  /**
   * Get the next upcoming milestone
   */
  _getNextMilestone(elapsedMinutes) {
    const baseMilestones = BermudaDefaults.milestones;

    // Check base milestones
    for (const milestone of baseMilestones) {
      if (milestone > elapsedMinutes) {
        return milestone;
      }
    }

    // Calculate next 15-minute interval milestone
    const nextInterval = Math.ceil(elapsedMinutes / BermudaDefaults.milestoneInterval) * BermudaDefaults.milestoneInterval;
    return nextInterval;
  }

  /**
   * Check if a milestone was just crossed
   * @param {number} previousMinutes - Previous elapsed minutes
   * @param {number} currentMinutes - Current elapsed minutes
   * @returns {array} Milestones that were crossed
   */
  checkMilestonesCrossed(previousMinutes, currentMinutes) {
    const previousMilestones = this._getMilestonesReached(previousMinutes);
    const currentMilestones = this._getMilestonesReached(currentMinutes);

    return currentMilestones.filter(m => !previousMilestones.includes(m));
  }

  /**
   * Round to 2 decimal places
   */
  _round2(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Round to 3 decimal places
   */
  _round3(value) {
    return Math.round(value * 1000) / 1000;
  }
}

export default new MeetingCostCalculator();
