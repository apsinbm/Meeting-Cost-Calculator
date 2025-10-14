import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import EmployeeService from './EmployeeService';
import MeetingService from './MeetingService';

/**
 * ExportService
 * Handles data export for user data portability
 */

class ExportService {
  /**
   * Export all employee data to CSV
   */
  static async exportEmployeesToCSV() {
    try {
      const employees = await EmployeeService.getEmployees();

      if (employees.length === 0) {
        return { success: false, error: 'No employees to export' };
      }

      // CSV header
      const header = 'Name,Role,Email,Annual Salary,Annual Bonus,Health Insurance,Per-Minute Cost,Hourly Cost,Total Annual Cost\n';

      // CSV rows
      const rows = employees.map((emp) => {
        return [
          `"${emp.name}"`,
          `"${emp.role}"`,
          `"${emp.email || ''}"`,
          emp.annualSalary || 0,
          emp.annualBonus || 0,
          emp.includesHealthInsurance ? 'Yes' : 'No',
          emp.perMinuteCost?.toFixed(3) || 0,
          emp.hourlyCost?.toFixed(2) || 0,
          emp.totalAnnualCost?.toFixed(2) || 0,
        ].join(',');
      }).join('\n');

      const csvContent = header + rows;

      // Create file path
      const fileName = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Employees',
          UTI: 'public.comma-separated-values-text',
        });
      }

      return { success: true, fileUri };
    } catch (error) {
      console.error('Error exporting employees to CSV:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export all meeting data to CSV
   */
  static async exportMeetingsToCSV() {
    try {
      const meetings = await MeetingService.getCompletedMeetings();

      if (meetings.length === 0) {
        return { success: false, error: 'No meetings to export' };
      }

      // CSV header
      const header = 'Title,Date,Start Time,Duration (min),Attendees,Actual Cost,Scheduled Duration,Status\n';

      // CSV rows
      const rows = meetings.map((meeting) => {
        const date = new Date(meeting.actualStart).toLocaleDateString();
        const time = new Date(meeting.actualStart).toLocaleTimeString();
        const attendeeNames = meeting.attendees?.map(a => a.name).join('; ') || '';
        const status = meeting.ranOver ? 'Ran Over' : meeting.endedEarly ? 'Ended Early' : 'On Time';

        return [
          `"${meeting.title}"`,
          date,
          time,
          meeting.actualMinutes || 0,
          `"${attendeeNames}"`,
          meeting.actualCost?.toFixed(2) || 0,
          meeting.durationMinutes || 0,
          status,
        ].join(',');
      }).join('\n');

      const csvContent = header + rows;

      // Create file path
      const fileName = `meetings_export_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Meetings',
          UTI: 'public.comma-separated-values-text',
        });
      }

      return { success: true, fileUri };
    } catch (error) {
      console.error('Error exporting meetings to CSV:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export all data (employees + meetings) as separate CSV files
   */
  static async exportAllData() {
    try {
      const employeesResult = await this.exportEmployeesToCSV();
      const meetingsResult = await this.exportMeetingsToCSV();

      return {
        success: employeesResult.success || meetingsResult.success,
        employeesResult,
        meetingsResult,
      };
    } catch (error) {
      console.error('Error exporting all data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ExportService;
