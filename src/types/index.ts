export type Priority = 'High' | 'Medium' | 'Low';

// Category types for tasks
export type Category = 'Study' | 'College' | 'Teaching' | 'Personal' | 'Health' | 'Skill Development' | 'Work' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: Category | string;
  priority: Priority;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  userId: string;
  createdAt?: string | number | any; // allow firebase timestamp
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  streak: number;
  lastCompletedDate?: string;
}
