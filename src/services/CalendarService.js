import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import EmployeeService from './EmployeeService';

/**
 * CalendarService
 * Reads calendar events and attendee information
 * Handles permissions and matching attendees to employees
 */

class CalendarService {
  constructor() {
    this.hasPermission = false;
  }

  /**
   * Request calendar permissions
   */
  async requestPermissions() {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  /**
   * Check current permission status
   */
  async checkPermissions() {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error checking calendar permissions:', error);
      return false;
    }
  }

  /**
   * Get calendars available on device
   */
  async getCalendars() {
    try {
      if (!this.hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return [];
      }

      const calendars = await Calendar.getCalendarsAsync();
      return calendars || [];
    } catch (error) {
      console.error('Error getting calendars:', error);
      return [];
    }
  }

  /**
   * Get events for a specific date range
   * @param {Date} startDate - Start of range
   * @param {Date} endDate - End of range
   */
  async getEvents(startDate, endDate) {
    try {
      if (!this.hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return [];
      }

      const calendars = await this.getCalendars();
      if (calendars.length === 0) return [];

      // Include all calendars we have access to (not just modifiable ones)
      // Most work/corporate calendars are read-only but we still need to read events from them
      const calendarIds = calendars.map(cal => cal.id);

      if (calendarIds.length === 0) return [];

      const events = await Calendar.getEventsAsync(
        calendarIds,
        startDate,
        endDate
      );

      return events || [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Get today's events
   */
  async getTodayEvents() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getEvents(startOfDay, endOfDay);
  }

  /**
   * Get events for a specific date
   */
  async getEventsForDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getEvents(startOfDay, endOfDay);
  }

  /**
   * Match calendar event attendees to employee profiles
   * @param {object} event - Calendar event
   * @returns {object} Matched and unmatched attendees
   */
  async matchAttendees(event) {
    const matched = [];
    const unmatched = [];

    // Get attendees from event (may not be available on all platforms)
    const attendees = event.attendees || [];

    if (attendees.length === 0) {
      return { matched, unmatched, hasAttendees: false };
    }

    for (const attendee of attendees) {
      const email = attendee.email;
      if (!email) continue;

      const employee = await EmployeeService.getEmployeeByEmail(email);

      if (employee) {
        matched.push({
          ...employee,
          attendeeData: attendee,
        });
      } else {
        unmatched.push({
          name: attendee.name || email,
          email,
          attendeeData: attendee,
        });
      }
    }

    return {
      matched,
      unmatched,
      hasAttendees: true,
      totalCount: matched.length + unmatched.length,
    };
  }

  /**
   * Convert calendar event to meeting object
   * @param {object} event - Calendar event
   * @returns {object} Meeting data
   */
  async convertEventToMeeting(event) {
    const attendees = await this.matchAttendees(event);

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const durationMinutes = Math.round((endDate - startDate) / (1000 * 60));

    return {
      calendarEventId: event.id,
      title: event.title || 'Untitled Meeting',
      scheduledStart: event.startDate,
      scheduledEnd: event.endDate,
      durationMinutes,
      location: event.location || null,
      notes: event.notes || null,
      attendees: {
        matched: attendees.matched,
        unmatched: attendees.unmatched,
        hasAttendees: attendees.hasAttendees,
        totalCount: attendees.totalCount || 0,
      },
    };
  }

  /**
   * Get today's meetings with matched attendees
   */
  async getTodayMeetings() {
    try {
      const events = await this.getTodayEvents();
      const meetings = [];

      for (const event of events) {
        const meeting = await this.convertEventToMeeting(event);
        meetings.push(meeting);
      }

      // Sort by start time
      meetings.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));

      return meetings;
    } catch (error) {
      console.error('Error getting today\'s meetings:', error);
      return [];
    }
  }

  /**
   * Check if a meeting is happening now
   */
  isMeetingNow(meeting) {
    const now = new Date();
    const start = new Date(meeting.scheduledStart);
    const end = new Date(meeting.scheduledEnd);

    return now >= start && now <= end;
  }

  /**
   * Check if a meeting is upcoming (starts within next hour)
   */
  isMeetingUpcoming(meeting) {
    const now = new Date();
    const start = new Date(meeting.scheduledStart);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return start > now && start <= oneHourFromNow;
  }

  /**
   * Check if a meeting is in the past
   */
  isMeetingPast(meeting) {
    const now = new Date();
    const end = new Date(meeting.scheduledEnd);

    return end < now;
  }
}

export default new CalendarService();
