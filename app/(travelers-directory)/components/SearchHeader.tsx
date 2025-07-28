"use client";

import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { 
  searchQueryAtom, 
  filterDepartmentAtom, 
  employeesAtom 
} from '@/application/atoms/travelersDirectoryAtom';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Search, Users } from 'lucide-react';

export const SearchHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filterDepartment, setFilterDepartment] = useAtom(filterDepartmentAtom);
  const employees = useAtomValue(employeesAtom);

  // Get unique departments
  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <div className="w-full bg-white border-b p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search travelers by name, title, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border border-gray-300 focus:border-gray-500 bg-white"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full sm:w-48">
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="border border-gray-300 focus:border-gray-500 bg-white">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>All Departments</span>
                </div>
              </SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 font-medium">
          {employees.length} {employees.length === 1 ? 'traveler' : 'travelers'}
        </div>
      </div>
    </div>
  );
};
