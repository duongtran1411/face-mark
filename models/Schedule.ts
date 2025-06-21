import { Shift } from './Shift';
import { ClassData } from './Classdata';
import { Classroom } from './Classroom';
import { Teacher } from './Teacher';
import { Module } from './Module';

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