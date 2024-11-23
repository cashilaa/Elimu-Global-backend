import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PerformanceMetric } from './student.service';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.studentService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/performance')
  async getPerformance(@Request() req): Promise<PerformanceMetric[]> {
    return this.studentService.getPerformanceData(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('achievements')
  async getAchievements(@Request() req) {
    return this.studentService.getAchievements(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('achievements/streak')
  async updateStreak(@Request() req) {
    return this.studentService.updateStudyStreak(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/report')
  async getReport(@Request() req) {
    return this.studentService.generateReport(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chatbot')
  async chatWithBot(@Request() req, @Body() body: { message: string }) {
    return this.studentService.handleChatbotMessage(req.user.id, body.message);
  }
}
