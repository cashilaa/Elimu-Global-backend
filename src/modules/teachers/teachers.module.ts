import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './teacher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema }
    ])
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema }
    ])
  ]
})
export class TeachersModule {}
