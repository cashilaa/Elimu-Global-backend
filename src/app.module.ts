import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './modules/courses/courses.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Attempting to connect to MongoDB with URI:', uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    CoursesModule,
    StudentsModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
