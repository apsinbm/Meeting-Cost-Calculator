import StorageService from './StorageService';
import MeetingCostCalculator from './MeetingCostCalculator';

/**
 * MeetingService
 * Manages meeting records, tracking, and history
 */

class MeetingService {
  /**
   * Get all meetings
   */
  async getMeetings() {
    try {
      return await StorageService.getMeetings();
    } catch (error) {
      console.error('Error getting meetings:', error);
      return [];
    }
  }

  /**
   * Get meeting by ID
   */
  async getMeetingById(id) {
    try {
      const meetings = await this.getMeetings();
      return meetings.find(meeting => meeting.id === id);
    } catch (error) {
      console.error('Error getting meeting:', error);
      return null;
    }
  }

  /**
   * Create new meeting
   */
  async createMeeting(meetingData) {
    try {
      const meeting = {
        id: this._generateId(),
        ...meetingData,
        status: meetingData.status || 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const meetings = await this.getMeetings();
      meetings.push(meeting);
      await StorageService.saveMeetings(meetings);

      return {
        success: true,
        meeting,
      };
    } catch (error) {
      console.error('Error creating meeting:', error);
      return {
        success: false,
        error: 'Failed to create meeting',
      };
    }
  }

  /**
   * Update existing meeting
   */
  async updateMeeting(id, updates) {
    try {
      const meetings = await this.getMeetings();
      const index = meetings.findIndex(m => m.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Meeting not found',
        };
      }

      meetings[index] = {
        ...meetings[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await StorageService.saveMeetings(meetings);

      return {
        success: true,
        meeting: meetings[index],
      };
    } catch (error) {
      console.error('Error updating meeting:', error);
      return {
        success: false,
        error: 'Failed to update meeting',
      };
    }
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id) {
    try {
      const meetings = await this.getMeetings();
      const filtered = meetings.filter(m => m.id !== id);

      await StorageService.saveMeetings(filtered);

      return { success: true };
    } catch (error) {
      console.error('Error deleting meeting:', error);
      return {
        success: false,
        error: 'Failed to delete meeting',
      };
    }
  }

  /**
   * Start meeting tracking
   */
  async startMeeting(meetingData, attendees) {
    try {
      const actualStart = new Date().toISOString();

      const meeting = {
        id: this._generateId(),
        ...meetingData,
        actualStart,
        attendees,
        status: 'in_progress',
        milestones: [],
        createdAt: actualStart,
        updatedAt: actualStart,
      };

      const meetings = await this.getMeetings();
      meetings.push(meeting);
      await StorageService.saveMeetings(meetings);

      return {
        success: true,
        meeting,
      };
    } catch (error) {
      console.error('Error starting meeting:', error);
      return {
        success: false,
        error: 'Failed to start meeting',
      };
    }
  }

  /**
   * End meeting tracking
   * @param {string} id - Meeting ID
   * @param {number} pausedTimeMs - Total paused time in milliseconds (default 0)
   */
  async endMeeting(id, pausedTimeMs = 0) {
    try {
      const meetings = await this.getMeetings();
      const index = meetings.findIndex(m => m.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Meeting not found',
        };
      }

      const meeting = meetings[index];
      const actualEnd = new Date().toISOString();

      // Calculate actual duration (subtract paused time)
      const startTime = new Date(meeting.actualStart);
      const endTime = new Date(actualEnd);
      const wallClockMs = endTime - startTime;
      const activeMs = wallClockMs - pausedTimeMs;
      const actualMinutes = Math.round(activeMs / (1000 * 60));

      // Calculate final costs
      const scheduledMinutes = meeting.durationMinutes || 0;
      const finalCosts = MeetingCostCalculator.calculateFinalCost(
        meeting.attendees,
        actualMinutes,
        scheduledMinutes
      );

      meetings[index] = {
        ...meeting,
        actualEnd,
        actualMinutes,
        pausedTimeMs, // Store for reference/debugging
        status: 'completed',
        actualCost: finalCosts.actualCost,
        costDifference: finalCosts.costDifference,
        ranOver: finalCosts.ranOver,
        endedEarly: finalCosts.endedEarly,
        minutesDifference: actualMinutes - scheduledMinutes,
        updatedAt: actualEnd,
      };

      await StorageService.saveMeetings(meetings);

      return {
        success: true,
        meeting: meetings[index],
      };
    } catch (error) {
      console.error('Error ending meeting:', error);
      return {
        success: false,
        error: 'Failed to end meeting',
      };
    }
  }

  /**
   * Add milestone to meeting
   */
  async addMilestone(meetingId, milestone) {
    try {
      const meetings = await this.getMeetings();
      const index = meetings.findIndex(m => m.id === meetingId);

      if (index === -1) {
        return { success: false };
      }

      meetings[index].milestones = meetings[index].milestones || [];
      meetings[index].milestones.push({
        ...milestone,
        timestamp: new Date().toISOString(),
      });

      await StorageService.saveMeetings(meetings);

      return { success: true };
    } catch (error) {
      console.error('Error adding milestone:', error);
      return { success: false };
    }
  }

  /**
   * Get meetings for date range
   */
  async getMeetingsInRange(startDate, endDate) {
    try {
      const meetings = await this.getMeetings();

      return meetings.filter(meeting => {
        const meetingDate = new Date(meeting.scheduledStart || meeting.actualStart);
        return meetingDate >= startDate && meetingDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting meetings in range:', error);
      return [];
    }
  }

  /**
   * Get completed meetings
   */
  async getCompletedMeetings() {
    try {
      const meetings = await this.getMeetings();
      return meetings.filter(m => m.status === 'completed');
    } catch (error) {
      console.error('Error getting completed meetings:', error);
      return [];
    }
  }

  /**
   * Get meetings summary statistics
   */
  async getMeetingsSummary(meetings = null) {
    try {
      const allMeetings = meetings || await this.getCompletedMeetings();

      if (allMeetings.length === 0) {
        return {
          totalMeetings: 0,
          totalCost: 0,
          totalMinutes: 0,
          averageCost: 0,
          averageDuration: 0,
        };
      }

      const totalCost = allMeetings.reduce((sum, m) => sum + (m.actualCost || 0), 0);
      const totalMinutes = allMeetings.reduce((sum, m) => sum + (m.actualMinutes || 0), 0);

      return {
        totalMeetings: allMeetings.length,
        totalCost: Math.round(totalCost * 100) / 100,
        totalMinutes,
        averageCost: Math.round((totalCost / allMeetings.length) * 100) / 100,
        averageDuration: Math.round(totalMinutes / allMeetings.length),
      };
    } catch (error) {
      console.error('Error getting meetings summary:', error);
      return null;
    }
  }

  /**
   * Generate unique ID
   */
  _generateId() {
    return `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new MeetingService();
