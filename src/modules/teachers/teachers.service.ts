import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from './teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const createdTeacher = new this.teacherModel(createTeacherDto);
    return createdTeacher.save();
  }

  async findAll(query: any): Promise<Teacher[]> {
    return this.teacherModel.find(query).exec();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: Partial<CreateTeacherDto>): Promise<Teacher> {
    const updatedTeacher = await this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .exec();
    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return updatedTeacher;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teacherModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findOne({ email }).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${email} not found`);
    }
    return teacher;
  }

  async getTeacherCourses(id: string): Promise<any[]> {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('courses')
      .exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher.courses;
  }

  async assignCourse(teacherId: string, courseId: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(teacherId).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    if (!teacher.courses.includes(courseId)) {
      teacher.courses.push(courseId);
      await teacher.save();
    }

    return teacher;
  }

  async removeCourse(teacherId: string, courseId: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(teacherId).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    teacher.courses = teacher.courses.filter(id => id.toString() !== courseId);
    return teacher.save();
  }
}
