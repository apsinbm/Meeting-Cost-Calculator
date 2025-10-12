import { Linking } from 'react-native';
import EmployeeCostCalculator from './EmployeeCostCalculator';

/**
 * EmailService
 * Generates and sends meeting cost reports via native email
 */

class EmailService {
  /**
   * Generate email report for meetings
   * @param {array} meetings - Meetings to include in report
   * @param {string} periodDescription - Description of time period
   * @returns {object} Email subject and body
   */
  generateReport(meetings, periodDescription = 'All Time') {
    const subject = `Meeting Cost Report - ${periodDescription}`;

    const body = this._buildEmailBody(meetings, periodDescription);

    return {
      subject,
      body,
    };
  }

  /**
   * Open native email client with report
   */
  async sendReport(meetings, periodDescription = 'All Time', recipientEmail = '') {
    try {
      const { subject, body } = this.generateReport(meetings, periodDescription);

      const emailUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Cannot open email client',
        };
      }
    } catch (error) {
      console.error('Error sending report:', error);
      return {
        success: false,
        error: 'Failed to open email client',
      };
    }
  }

  /**
   * Build email body content
   */
  _buildEmailBody(meetings, periodDescription) {
    if (meetings.length === 0) {
      return `No meetings found for ${periodDescription}.`;
    }

    let body = '';

    // Header
    body += `MEETING COST REPORT\n`;
    body += `Period: ${periodDescription}\n`;
    body += `Generated: ${new Date().toLocaleDateString()}\n`;
    body += `\n${'='.repeat(50)}\n\n`;

    // Executive Summary
    body += `EXECUTIVE SUMMARY\n`;
    body += `${'-'.repeat(50)}\n`;

    const totalCost = meetings.reduce((sum, m) => sum + (m.actualCost || 0), 0);
    const totalMinutes = meetings.reduce((sum, m) => sum + (m.actualMinutes || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const avgCost = totalCost / meetings.length;

    body += `Total Meetings: ${meetings.length}\n`;
    body += `Total Cost: ${EmployeeCostCalculator.formatCurrency(totalCost)}\n`;
    body += `Total Time: ${totalHours} hours\n`;
    body += `Average Cost Per Meeting: ${EmployeeCostCalculator.formatCurrency(avgCost)}\n`;
    body += `\n`;

    // Top 10 Most Expensive Meetings
    body += `\nTOP 10 MOST EXPENSIVE MEETINGS\n`;
    body += `${'-'.repeat(50)}\n`;

    const sortedByost = [...meetings].sort((a, b) => (b.actualCost || 0) - (a.actualCost || 0));
    const top10 = sortedByost.slice(0, 10);

    top10.forEach((meeting, index) => {
      const date = new Date(meeting.actualStart || meeting.scheduledStart).toLocaleDateString();
      const cost = EmployeeCostCalculator.formatCurrency(meeting.actualCost || 0);
      const duration = meeting.actualMinutes || 0;

      body += `${index + 1}. ${meeting.title}\n`;
      body += `   Date: ${date} | Duration: ${duration} min | Cost: ${cost}\n`;
    });

    body += `\n`;

    // Meeting Patterns
    body += `\nMEETING PATTERNS\n`;
    body += `${'-'.repeat(50)}\n`;

    const overrunMeetings = meetings.filter(m => m.ranOver).length;
    const earlyEndMeetings = meetings.filter(m => m.endedEarly).length;
    const onTimeMeetings = meetings.length - overrunMeetings - earlyEndMeetings;

    body += `Ran Over Schedule: ${overrunMeetings} (${Math.round((overrunMeetings / meetings.length) * 100)}%)\n`;
    body += `Ended Early: ${earlyEndMeetings} (${Math.round((earlyEndMeetings / meetings.length) * 100)}%)\n`;
    body += `On Time: ${onTimeMeetings} (${Math.round((onTimeMeetings / meetings.length) * 100)}%)\n`;

    if (overrunMeetings > 0) {
      const overrunCost = meetings
        .filter(m => m.ranOver)
        .reduce((sum, m) => sum + (m.costDifference || 0), 0);
      body += `\nCost of Overruns: ${EmployeeCostCalculator.formatCurrency(overrunCost)}\n`;
    }

    body += `\n`;

    // Footer
    body += `\n${'='.repeat(50)}\n`;
    body += `\n🤖 Generated with Meeting Cost Calculator\n`;
    body += `All data stored locally on device.\n`;

    return body;
  }

  /**
   * Generate simplified report (fewer details)
   */
  generateSimpleReport(meetings, periodDescription = 'All Time') {
    if (meetings.length === 0) {
      return {
        subject: `Meeting Cost Report - ${periodDescription}`,
        body: `No meetings found for ${periodDescription}.`,
      };
    }

    const totalCost = meetings.reduce((sum, m) => sum + (m.actualCost || 0), 0);
    const totalHours = Math.round((meetings.reduce((sum, m) => sum + (m.actualMinutes || 0), 0) / 60) * 10) / 10;

    const body = `Meeting Cost Summary for ${periodDescription}:\n\n` +
      `Meetings: ${meetings.length}\n` +
      `Total Cost: ${EmployeeCostCalculator.formatCurrency(totalCost)}\n` +
      `Total Time: ${totalHours} hours\n\n` +
      `🤖 Generated with Meeting Cost Calculator`;

    return {
      subject: `Meeting Cost Report - ${periodDescription}`,
      body,
    };
  }
}

export default new EmailService();
