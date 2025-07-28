"use client";

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { 
  filteredEmployeesAtom, 
  selectedEmployeeAtom, 
  viewModeAtom,
  Employee 
} from '@/application/atoms/travelersDirectoryAtom';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const employees = useAtomValue(filteredEmployeesAtom);
  const setSelectedEmployee = useSetAtom(selectedEmployeeAtom);
  const setViewMode = useSetAtom(viewModeAtom);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewMode('passport');
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }).format(date);
  };

  if (employees.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No team members found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map((employee) => (
          <Card 
            key={employee.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-1 bg-white shadow-sm border border-gray-200 hover:border-gray-300"
            onClick={() => handleEmployeeClick(employee)}
          >
            <CardContent className="p-5">
              {/* Profile Header */}
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 h-12 w-12 flex items-center justify-center text-lg font-bold mr-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <span className="text-gray-700">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base mb-1 truncate group-hover:text-gray-800">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-1 truncate">
                    {employee.jobTitle}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {employee.department}
                  </p>
                </div>
              </div>

              {/* Skills Preview */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {employee.skills.slice(0, 2).map((skill) => (
                    <Badge 
                      key={skill.id} 
                      variant="outline"
                      className="text-xs px-2.5 py-1 border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {employee.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1 border-gray-300 text-gray-600 bg-gray-50">
                      +{employee.skills.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{employee.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Joined {formatJoinDate(employee.joinDate)}</span>
                </div>
                
                {/* Fun Fact Preview */}
                {employee.fieldNotes.funFact && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200 group-hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      {employee.fieldNotes.funFact.length > 80 
                        ? employee.fieldNotes.funFact.substring(0, 80) + '...' 
                        : employee.fieldNotes.funFact}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
