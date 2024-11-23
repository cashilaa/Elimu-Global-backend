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
}
