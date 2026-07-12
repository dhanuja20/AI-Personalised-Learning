import { Course, StudentStats, Deadline } from "./types";

export const INITIAL_DEADLINES: Deadline[] = [
  { id: "dl-1", title: "Deep Learning Quiz", dueDate: "Due Tomorrow", completed: false },
  { id: "dl-2", title: "Math for AI Final", dueDate: "Due in 3 days", completed: false }
];

export const INITIAL_STATS: StudentStats = {
  active: 3,
  done: 12,
  streak: 7,
  score: 88,
  weeklyHours: [2, 3, 2.5, 5, 3.5, 1, 0.5] // Monday - Sunday study hours represent the custom line-bar chart
};
