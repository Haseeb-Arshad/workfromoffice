"use client";

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { 
  selectedEmployeeAtom, 
  viewModeAtom
} from '@/application/atoms/travelersDirectoryAtom';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Calendar, 
  Coffee, 
  Tv, 
  Heart, 
  Quote,
  Lightbulb,
  Clock,
  Globe
} from 'lucide-react';

export const PassportView: React.FC = () => {
  const selectedEmployee = useAtomValue(selectedEmployeeAtom);
  const setViewMode = useSetAtom(viewModeAtom);

  if (!selectedEmployee) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-gray-600">No employee selected</p>
        </div>
      </div>
    );
  }

  const handleBackToGallery = () => {
    setViewMode('gallery');
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatProjectDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short'
    }).format(date);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white text-gray-800 px-4 py-3 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackToGallery}
            className="text-gray-700 hover:bg-gray-100 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-lg font-medium text-gray-700">
              {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h1>
              <p className="text-sm text-gray-600">Profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Basic Information */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo and Name */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-medium text-gray-700 mb-3">
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{selectedEmployee.name}</h2>
                  <p className="text-gray-600 mb-2">{selectedEmployee.jobTitle}</p>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    {selectedEmployee.department}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{selectedEmployee.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Joined: {formatJoinDate(selectedEmployee.joinDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Projects */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">
                Skills and Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Skills Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedEmployee.skills.map((skill) => (
                    <div key={skill.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {skill.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Projects Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
                <div className="space-y-3">
                  {selectedEmployee.projects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Role: {project.role}</div>
                        <div>Start: {formatProjectDate(project.startDate)}</div>
                        {project.endDate && (
                          <div>End: {formatProjectDate(project.endDate)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Notes */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">
                Field Notes
              </CardTitle>  
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">

                {/* Personal Insights */}
                <div className="space-y-3">
                  {selectedEmployee.fieldNotes.favoriteTea && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Coffee className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Favorite Tea</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedEmployee.fieldNotes.favoriteTea}</p>
                    </div>
                  )}

                  {selectedEmployee.fieldNotes.favoriteShow && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Tv className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Favorite Show</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedEmployee.fieldNotes.favoriteShow}</p>
                    </div>
                  )}

                  {selectedEmployee.fieldNotes.hobbies && selectedEmployee.fieldNotes.hobbies.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Hobbies</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedEmployee.fieldNotes.hobbies.map((hobby, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Notes */}
                <div className="space-y-3">
                  {selectedEmployee.fieldNotes.inspirationalQuote && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Quote className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Quote</span>
                      </div>
                      <p className='text-sm text-gray-700 italic'>{selectedEmployee.fieldNotes.inspirationalQuote}</p>
                    </div>
                  )}

                  {selectedEmployee.fieldNotes.uniqueSkill && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Unique Skill</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedEmployee.fieldNotes.uniqueSkill}</p>
                    </div>
                  )}

                  {selectedEmployee.fieldNotes.workingStyle && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Work Style</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedEmployee.fieldNotes.workingStyle}</p>
                    </div>
                  )}

                  {selectedEmployee.fieldNotes.timezone && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Timezone</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedEmployee.fieldNotes.timezone}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
