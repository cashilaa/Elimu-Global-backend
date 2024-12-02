import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Course, Module, Lecture, Assessment } from './course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { ModuleDto } from './dto/module.dto';
import { LectureDto } from './dto/lecture.dto';
import { AssessmentDto } from './dto/assessment.dto';
import { ProgressDto } from './dto/progress.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAll(query: any): Promise<Course[]> {
    return this.courseModel.find(query).exec();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return updatedCourse;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
  }

  async findByCategory(category: string): Promise<Course[]> {
    return this.courseModel.find({ category }).exec();
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseModel.find({ instructor: instructorId }).exec();
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    if (!course.enrolledStudents.includes(studentId)) {
      course.enrolledStudents.push(studentId);
      course.studentProgress.push({
        studentId,
        overallProgress: 0,
        lastAccessDate: new Date(),
        moduleProgress: [],
        assessmentScores: [],
        completed: false,
      });
      return course.save();
    }
    return course;
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    course.enrolledStudents = course.enrolledStudents.filter(id => id !== studentId);
    course.studentProgress = course.studentProgress.filter(progress => progress.studentId !== studentId);
    return course.save();
  }

  async addModule(courseId: string, moduleDto: ModuleDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const newModule = {
      ...moduleDto,
      _id: new Schema.Types.ObjectId('module'),
      lectures: [],
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Module;

    course.modules.push(newModule);
    return course.save();
  }

  async updateModule(courseId: string, moduleId: string, moduleDto: Partial<ModuleDto>): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const moduleIndex = course.modules.findIndex(m => m._id.toString() === moduleId);
    if (moduleIndex === -1) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    const existingModule = course.modules[moduleIndex];
    course.modules[moduleIndex] = {
      ...existingModule,
      ...moduleDto,
      updatedAt: new Date()
    } as unknown as Module;

    return course.save();
  }

  async getModules(courseId: string): Promise<Course> {
    return this.findOne(courseId);
  }

  async addLecture(courseId: string, moduleId: string, lectureDto: LectureDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const module = course.modules.find(m => m._id.toString() === moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    const newLecture = {
      _id: new Schema.Types.ObjectId('lecture'),
      title: lectureDto.title,
      content: lectureDto.content,
      type: lectureDto.type,
      duration: lectureDto.duration,
      resources: lectureDto.resources || [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as Lecture;

    module.lectures.push(newLecture);
    return course.save();
  }

  async createAssessment(courseId: string, moduleId: string, assessmentDto: AssessmentDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const module = course.modules.find(m => m._id.toString() === moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    const newAssessment = {
      _id: new Schema.Types.ObjectId('assessment'),
      title: assessmentDto.title,
      questions: assessmentDto.questions.map(q => ({
        text: q.text,
        options: q.options,
        correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
        explanation: q.explanation
      })),
      passingScore: assessmentDto.passingScore,
      timeLimit: assessmentDto.timeLimit,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Assessment;

    module.assessments.push(newAssessment);
    return course.save();
  }

  async submitAssessment(
    courseId: string,
    moduleId: string,
    assessmentId: string,
    studentId: string,
    submissionData: any,
  ): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const studentProgress = course.studentProgress.find(p => p.studentId === studentId);
    if (!studentProgress) {
      throw new NotFoundException(`Student progress not found for student "${studentId}"`);
    }

    const score = this.calculateAssessmentScore(submissionData); // Implement scoring logic
    
    const assessmentScore = {
      assessmentId,
      score,
      attempts: 1,
      lastAttemptDate: new Date(),
    };

    const existingScoreIndex = studentProgress.assessmentScores.findIndex(
      a => a.assessmentId === assessmentId,
    );

    if (existingScoreIndex > -1) {
      studentProgress.assessmentScores[existingScoreIndex].attempts += 1;
      studentProgress.assessmentScores[existingScoreIndex].score = score;
      studentProgress.assessmentScores[existingScoreIndex].lastAttemptDate = new Date();
    } else {
      studentProgress.assessmentScores.push(assessmentScore);
    }

    await this.updateOverallProgress(course, studentId);
    return course.save();
  }

  private calculateAssessmentScore(submissionData: any): number {
    // Implement assessment scoring logic based on your requirements
    return 0; // Placeholder
  }

  async updateProgress(courseId: string, studentId: string, progressDto: ProgressDto): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const studentProgressIndex = course.studentProgress.findIndex(
      p => p.studentId === studentId,
    );

    if (studentProgressIndex === -1) {
      throw new NotFoundException(`Student progress not found for student "${studentId}"`);
    }

    course.studentProgress[studentProgressIndex] = {
      ...course.studentProgress[studentProgressIndex],
      ...progressDto,
      lastAccessDate: new Date(),
    };

    await this.updateOverallProgress(course, studentId);
    return course.save();
  }

  private async updateOverallProgress(course: Course, studentId: string): Promise<void> {
    const studentProgress = course.studentProgress.find(p => p.studentId === studentId);
    if (!studentProgress) return;

    const totalModules = course.modules.length;
    const completedModules = studentProgress.moduleProgress.filter(m => m.progress === 100).length;
    studentProgress.overallProgress = (completedModules / totalModules) * 100;

    if (studentProgress.overallProgress === 100 && !studentProgress.completed) {
      studentProgress.completed = true;
      studentProgress.completionDate = new Date();
    }
  }

  async getProgress(courseId: string, studentId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const progress = course.studentProgress.find(p => p.studentId === studentId);
    if (!progress) {
      throw new NotFoundException(`Student progress not found for student "${studentId}"`);
    }

    return progress;
  }

  async generateCertificate(courseId: string, studentId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const progress = course.studentProgress.find(p => p.studentId === studentId);
    if (!progress) {
      throw new NotFoundException(`Student progress not found for student "${studentId}"`);
    }

    if (!progress.completed) {
      throw new Error('Cannot generate certificate for incomplete course');
    }

    if (!progress.certificateIssued) {
      progress.certificateIssued = true;
      progress.certificateIssuedDate = new Date();
      await course.save();
    }

    return {
      courseId,
      studentId,
      courseName: course.title,
      completionDate: progress.completionDate,
      certificateIssuedDate: progress.certificateIssuedDate,
    };
  }

  async searchCourses(query: string): Promise<Course[]> {
    return this.courseModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }

  async getRecommendedCourses(studentId: string): Promise<Course[]> {
    // Implement recommendation logic based on:
    // 1. Student's completed courses
    // 2. Student's interests/category preferences
    // 3. Course ratings and popularity
    // 4. Similar students' choices
    return this.courseModel
      .find({
        status: 'published',
        enrolledStudents: { $ne: studentId },
      })
      .sort({ rating: -1 })
      .limit(5)
      .exec();
  }
}