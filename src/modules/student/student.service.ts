import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { supabase } from '../../config/supabase.config';

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface EnrolledCourse {
  id: number;
  course: {
    id: number;
    title: string;
    description: string;
  };
  progress: number;
}

export interface UserStats {
  average_score: number;
  upcoming_tests: number;
}

export interface StudyStreak {
  current_streak: number;
  last_study_date: string;
}

export interface PerformanceMetric {
  month: string;
  score: number;
  attendance: number;
}

export interface UserAchievement {
  id: number;
  achievement: {
    name: string;
    icon: string;
  };
  progress: number;
}

export interface UserSettings {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    assignments: boolean;
    grades: boolean;
    announcements: boolean;
    reminders: boolean;
  };
  privacy: {
    profileVisibility: string;
    showEmail: boolean;
    showProgress: boolean;
    showAchievements: boolean;
  };
  academic: {
    timeZone: string;
    dateFormat: string;
    timeFormat: string;
    defaultView: string;
  };
  accessibility: {
    fontSize: string;
    contrast: string;
    animations: boolean;
  };
}

@Injectable()
export class StudentService {
  constructor(private readonly jwtService: JwtService) {}

  async getProfile(userId: string) {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw new Error(userError.message);
      if (!user) throw new NotFoundException('User not found');

      // Get enrolled courses
      const { data: enrolledCourses, error: coursesError } = await supabase
        .from('enrolled_courses')
        .select(`
          id,
          course:courses (
            id,
            title,
            description
          ),
          progress
        `)
        .eq('user_id', userId);

      if (coursesError) throw new Error(coursesError.message);

      // Get user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError) throw new Error(statsError.message);

      return {
        name: user.full_name,
        enrolledCourses: enrolledCourses.map((ec: any) => ({
          id: ec.id,
          course: Array.isArray(ec.course) ? ec.course[0] : ec.course,
          progress: ec.progress
        })),
        stats: {
          coursesEnrolled: enrolledCourses.length,
          averageScore: (stats as UserStats)?.average_score || 0,
          upcomingTests: (stats as UserStats)?.upcoming_tests || 0
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getPerformanceData(userId: string) {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('month, score, attendance')
        .eq('user_id', userId)
        .order('month', { ascending: true });

      if (error) throw new Error(error.message);
      return data as PerformanceMetric[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAchievements(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          achievement:achievements (
            name,
            icon
          ),
          progress
        `)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);

      return data.map((ua: any) => ({
        id: ua.id,
        name: ua.achievement[0]?.name || '',
        icon: ua.achievement[0]?.icon || '',
        progress: ua.progress
      }));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStudyStreak(userId: string) {
    try {
      // Get current streak
      const { data: currentStreak, error: streakError } = await supabase
        .from('study_streaks')
        .select('current_streak, last_study_date')
        .eq('user_id', userId)
        .single();

      if (streakError) throw new Error(streakError.message);

      const today = new Date();
      const lastStudyDate = (currentStreak as StudyStreak)?.last_study_date 
        ? new Date((currentStreak as StudyStreak).last_study_date)
        : null;

      let newStreak = 1;
      if (lastStudyDate) {
        const dayDifference = Math.floor(
          (today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDifference === 1) {
          // Consecutive day
          newStreak = (currentStreak as StudyStreak).current_streak + 1;
        } else if (dayDifference === 0) {
          // Same day, keep current streak
          newStreak = (currentStreak as StudyStreak).current_streak;
        }
      }

      // Update streak
      const { data: updatedStreak, error: updateError } = await supabase
        .from('study_streaks')
        .upsert({
          user_id: userId,
          current_streak: newStreak,
          last_study_date: today.toISOString()
        })
        .select('current_streak')
        .single();

      if (updateError) throw new Error(updateError.message);

      return {
        currentStreak: (updatedStreak as StudyStreak).current_streak
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async generateReport(userId: string) {
    try {
      // Get user's performance data
      const { data: performance, error: perfError } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId);

      if (perfError) throw new Error(perfError.message);

      // TODO: Implement actual PDF generation
      // For now, return a mock URL
      return {
        url: `/reports/${userId}/latest.pdf`
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async handleChatbotMessage(userId: string, message: string) {
    try {
      // Store the chat message
      const { error: chatError } = await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          message,
          sender: 'user'
        });

      if (chatError) throw new Error(chatError.message);

      // TODO: Implement actual AI chatbot integration
      const botResponse = "I understand your question. Let me help you with that...";

      // Store bot's response
      const { error: responseError } = await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          message: botResponse,
          sender: 'bot'
        });

      if (responseError) throw new Error(responseError.message);

      return {
        response: botResponse
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSettings(userId: string): Promise<UserSettings> {
    try {
      const defaultSettings: UserSettings = {
        theme: 'default',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sound: true,
          assignments: true,
          grades: true,
          announcements: true,
          reminders: true
        },
        privacy: {
          profileVisibility: 'private',
          showEmail: false,
          showProgress: false,
          showAchievements: false
        },
        academic: {
          timeZone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          defaultView: 'dashboard'
        },
        accessibility: {
          fontSize: 'medium',
          contrast: 'normal',
          animations: true
        }
      };

      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw new Error(error.message);

      if (!settings) {
        // Create default settings if none exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert([{ 
            user_id: userId,
            ...defaultSettings 
          }])
          .single();

        if (createError) throw new Error(createError.message);
        return defaultSettings;
      }

      // Merge existing settings with default settings to ensure all properties exist
      return {
        ...defaultSettings,
        ...settings
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSettings(userId: string, newSettings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .update({
          theme: newSettings.theme ?? 'default',
          language: newSettings.language ?? 'en',
          notifications: {
            email: newSettings.notifications?.email ?? true,
            push: newSettings.notifications?.push ?? true,
            sound: newSettings.notifications?.sound ?? true,
            assignments: newSettings.notifications?.assignments ?? true,
            grades: newSettings.notifications?.grades ?? true,
            announcements: newSettings.notifications?.announcements ?? true,
            reminders: newSettings.notifications?.reminders ?? true
          },
          privacy: {
            profileVisibility: newSettings.privacy?.profileVisibility ?? 'private',
            showEmail: newSettings.privacy?.showEmail ?? false,
            showProgress: newSettings.privacy?.showProgress ?? false,
            showAchievements: newSettings.privacy?.showAchievements ?? false
          },
          academic: {
            timeZone: newSettings.academic?.timeZone ?? 'UTC',
            dateFormat: newSettings.academic?.dateFormat ?? 'MM/DD/YYYY',
            timeFormat: newSettings.academic?.timeFormat ?? '12h',
            defaultView: newSettings.academic?.defaultView ?? 'dashboard'
          },
          accessibility: {
            fontSize: newSettings.accessibility?.fontSize ?? 'medium',
            contrast: newSettings.accessibility?.contrast ?? 'normal',
            animations: newSettings.accessibility?.animations ?? true
          }
        })
        .eq('user_id', userId)
        .single();

      if (error) throw new Error(error.message);

      return {
        theme: newSettings.theme ?? 'default',
        language: newSettings.language ?? 'en',
        notifications: {
          email: newSettings.notifications?.email ?? true,
          push: newSettings.notifications?.push ?? true,
          sound: newSettings.notifications?.sound ?? true,
          assignments: newSettings.notifications?.assignments ?? true,
          grades: newSettings.notifications?.grades ?? true,
          announcements: newSettings.notifications?.announcements ?? true,
          reminders: newSettings.notifications?.reminders ?? true
        },
        privacy: {
          profileVisibility: newSettings.privacy?.profileVisibility ?? 'private',
          showEmail: newSettings.privacy?.showEmail ?? false,
          showProgress: newSettings.privacy?.showProgress ?? false,
          showAchievements: newSettings.privacy?.showAchievements ?? false
        },
        academic: {
          timeZone: newSettings.academic?.timeZone ?? 'UTC',
          dateFormat: newSettings.academic?.dateFormat ?? 'MM/DD/YYYY',
          timeFormat: newSettings.academic?.timeFormat ?? '12h',
          defaultView: newSettings.academic?.defaultView ?? 'dashboard'
        },
        accessibility: {
          fontSize: newSettings.accessibility?.fontSize ?? 'medium',
          contrast: newSettings.accessibility?.contrast ?? 'normal',
          animations: newSettings.accessibility?.animations ?? true
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetSettings(userId: string): Promise<UserSettings> {
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sound: false,
            assignments: true,
            grades: true,
            announcements: true,
            reminders: true
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: true,
            showProgress: true,
            showAchievements: true
          },
          academic: {
            timeZone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            defaultView: 'week'
          },
          accessibility: {
            fontSize: 'medium',
            contrast: 'normal',
            animations: true
          }
        })
        .select('*')
        .single();

      if (error) throw new Error(error.message);

      if (!settings) {
        throw new NotFoundException('Settings not found');
      }

      return settings as UserSettings;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
