import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Employee interface
export interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  profileImage?: string;
  skills: Skill[];
  projects: Project[];
  fieldNotes: FieldNotes;
  joinDate: Date;
  location: string;
}

// Skill stamp interface
export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'creative' | 'language' | 'soft-skill';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  color: string;
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  startDate: Date;
  endDate?: Date;
}

// Field notes (personal info) interface
export interface FieldNotes {
  favoriteTea?: string;
  favoriteShow?: string;
  hobbies?: string[];
  inspirationalQuote?: string;
  uniqueSkill?: string;
  currentlyWatching?: string;
  hobby?: string;
  favoriteQuote?: string;
  funFact?: string;
  workingStyle?: string;
  timezone?: string;
}

// Sample data
const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Alice Chen',
    jobTitle: 'Lead Gardener of Code',
    department: 'Engineering',
    email: 'alice.chen@company.com',
    skills: [
      { id: 's1', name: 'React', category: 'technical', level: 'expert', color: '#61DAFB' },
      { id: 's2', name: 'TypeScript', category: 'technical', level: 'advanced', color: '#3178C6' },
      { id: 's3', name: 'Mentoring', category: 'soft-skill', level: 'expert', color: '#FF6B6B' },
    ],
    projects: [
      {
        id: 'p1',
        name: 'Design System Migration',
        description: 'Leading the transition to new component library',
        role: 'Tech Lead',
        status: 'ongoing',
        startDate: new Date('2024-01-15'),
      },
    ],
    fieldNotes: {
      favoriteTea: 'Earl Grey with honey',
      currentlyWatching: 'The Bear (Season 3)',
      hobby: 'Urban gardening',
      funFact: 'Has a collection of 47 houseplants',
      workingStyle: 'Early bird, prefers async communication',
    },
    joinDate: new Date('2022-03-01'),
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    jobTitle: 'Keeper of Stories',
    department: 'Content',
    email: 'marcus.johnson@company.com',
    skills: [
      { id: 's4', name: 'Content Strategy', category: 'creative', level: 'expert', color: '#9B59B6' },
      { id: 's5', name: 'Spanish', category: 'language', level: 'advanced', color: '#E74C3C' },
      { id: 's6', name: 'Video Editing', category: 'creative', level: 'intermediate', color: '#E67E22' },
    ],
    projects: [
      {
        id: 'p2',
        name: 'Brand Voice Guidelines',
        description: 'Defining company-wide content standards',
        role: 'Content Lead',
        status: 'completed',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-01-01'),
      },
    ],
    fieldNotes: {
      favoriteTea: 'Chamomile',
      currentlyWatching: 'Planet Earth III',
      hobby: 'Photography',
      funFact: 'Has visited 23 countries',
      workingStyle: 'Creative bursts, loves brainstorming sessions',
    },
    joinDate: new Date('2021-07-15'),
    location: 'Austin, TX',
  },
  {
    id: '3',
    name: 'Sarah Kim',
    jobTitle: 'Experience Architect',
    department: 'Design',
    email: 'sarah.kim@company.com',
    skills: [
      { id: 's7', name: 'Figma', category: 'creative', level: 'expert', color: '#F24E1E' },
      { id: 's8', name: 'User Research', category: 'soft-skill', level: 'advanced', color: '#2ECC71' },
      { id: 's9', name: 'Prototyping', category: 'creative', level: 'expert', color: '#3498DB' },
    ],
    projects: [
      {
        id: 'p3',
        name: 'Mobile App Redesign',
        description: 'Complete UX overhaul for mobile experience',
        role: 'Lead Designer',
        status: 'ongoing',
        startDate: new Date('2024-02-01'),
      },
    ],
    fieldNotes: {
      favoriteTea: 'Green tea with jasmine',
      currentlyWatching: 'Abstract: The Art of Design',
      hobby: 'Pottery',
      funFact: 'Makes her own ceramics',
      workingStyle: 'Visual thinker, loves whiteboarding',
    },
    joinDate: new Date('2022-11-01'),
    location: 'Seattle, WA',
  },
];

// Atoms
export const employeesAtom = atomWithStorage<Employee[]>('travelers-directory-employees', sampleEmployees);

export const selectedEmployeeAtom = atom<Employee | null>(null);

export const searchQueryAtom = atom<string>('');

export const filterDepartmentAtom = atom<string>('all');

export const viewModeAtom = atom<'gallery' | 'passport'>('gallery');

// Derived atoms
export const filteredEmployeesAtom = atom((get) => {
  const employees = get(employeesAtom);
  const searchQuery = get(searchQueryAtom);
  const filterDepartment = get(filterDepartmentAtom);

  return employees.filter((employee) => {
    const matchesSearch = !searchQuery || 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = filterDepartment === 'all' || 
      employee.department.toLowerCase() === filterDepartment.toLowerCase();

    return matchesSearch && matchesDepartment;
  });
});

// Action atoms
export const addEmployeeAtom = atom(
  null,
  (get, set, employee: Omit<Employee, 'id'>) => {
    const employees = get(employeesAtom);
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set(employeesAtom, [...employees, newEmployee]);
  }
);

export const updateEmployeeAtom = atom(
  null,
  (get, set, updatedEmployee: Employee) => {
    const employees = get(employeesAtom);
    const updatedEmployees = employees.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    set(employeesAtom, updatedEmployees);
  }
);

export const removeEmployeeAtom = atom(
  null,
  (get, set, employeeId: string) => {
    const employees = get(employeesAtom);
    const filteredEmployees = employees.filter((emp) => emp.id !== employeeId);
    set(employeesAtom, filteredEmployees);
  }
);
