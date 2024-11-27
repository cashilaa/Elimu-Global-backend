import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const createdStudent = new this.studentModel(createStudentDto);
    return createdStudent.save();
  }

  async findAll(query: any = {}): Promise<Student[]> {
    return this.studentModel.find(query).exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: Partial<CreateStudentDto>): Promise<Student> {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<Student> {
    return this.studentModel.findOne({ email }).exec();
  }

  async enrollInCourse(studentId: string, courseId: string): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    if (!student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      await student.save();
    }

    return student;
  }

  async updateProgress(studentId: string, courseId: string, progress: any): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    if (!student.progress) {
      student.progress = {};
    }

    student.progress[courseId] = {
      ...student.progress[courseId],
      ...progress,
      lastUpdated: new Date(),
    };

    return student.save();
  }

  async getProgress(studentId: string, courseId: string): Promise<any> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student.progress?.[courseId] || null;
  }
}
