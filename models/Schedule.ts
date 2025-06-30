import { AttendanceStudent } from './AttendanceListReponse';
import { ClassData } from './Classdata';
import { Classroom } from './Classroom';
import { Module } from './Module';
import { Shift } from './Shift';
import { Teacher } from './Teacher';

export interface Schedule {
  id: number;
  shift: Shift;
  class: ClassData;
  classroom: Classroom;
  teacher: Teacher;
  date: string;
  module: Module;
  dayOfWeek: string;
}

export interface ScheduleStudent {
  id: number;
  shift: Shift;
  class: ClassData;
  classroom: Classroom;
  teacher: Teacher;
  date: string;
  module: Module;
  attendances:AttendanceStudent[]
  dayOfWeek: string;
}
