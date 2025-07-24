"use client";

import React, { useState } from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/presentation/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Users, Calendar, DollarSign, FileText, Clock, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { playSound } from "@/infrastructure/lib/utils";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
}

interface LeaveRequest {
  id: number;
  employee: string;
  type: string;
  dates: string;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

export const HRPortal = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", position: "", department: "" });
  
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com", position: "Software Engineer", department: "Engineering", joinDate: "2022-01-15" },
    { id: 2, name: "Mike Chen", email: "mike.chen@company.com", position: "Product Manager", department: "Product", joinDate: "2021-11-20" },
    { id: 3, name: "Alex Rivera", email: "alex.rivera@company.com", position: "Designer", department: "Design", joinDate: "2023-03-10" },
    { id: 4, name: "Emma Davis", email: "emma.davis@company.com", position: "Marketing Specialist", department: "Marketing", joinDate: "2022-08-05" },
    { id: 5, name: "Tom Wilson", email: "tom.wilson@company.com", position: "DevOps Engineer", department: "Engineering", joinDate: "2021-05-12" },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 1, employee: "Sarah Johnson", type: "Vacation", dates: "Mar 15-17", status: "Pending", reason: "Family vacation" },
    { id: 2, employee: "Tom Wilson", type: "Sick Leave", dates: "Mar 20", status: "Approved", reason: "Medical appointment" },
    { id: 3, employee: "Lisa Garcia", type: "Personal", dates: "Mar 22-23", status: "Pending", reason: "Personal matters" },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, user: "Sarah Johnson", action: "Applied for vacation leave", time: "2 hours ago" },
    { id: 2, user: "Mike Chen", action: "Updated emergency contact", time: "4 hours ago" },
    { id: 3, user: "Alex Rivera", action: "Submitted expense report", time: "6 hours ago" },
    { id: 4, user: "Emma Davis", action: "Completed training module", time: "1 day ago" },
  ]);

  const stats = [
    { label: "Total Employees", value: employees.length.toString(), icon: Users, color: "text-blue-600" },
    { label: "Pending Leave", value: leaveRequests.filter(r => r.status === "Pending").length.toString(), icon: Calendar, color: "text-orange-600" },
    { label: "Payroll Due", value: "3 days", icon: DollarSign, color: "text-green-600" },
    { label: "Open Positions", value: "5", icon: FileText, color: "text-purple-600" },
  ];

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.position && newEmployee.department) {
      const employee: Employee = {
        id: employees.length + 1,
        ...newEmployee,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: "", email: "", position: "", department: "" });
      setIsAddEmployeeOpen(false);
      
      // Add activity
      const activity: Activity = {
        id: activities.length + 1,
        user: "HR System",
        action: `Added new employee: ${employee.name}`,
        time: "Just now"
      };
      setActivities([activity, ...activities]);
      playSound("/sounds/click.mp3");
    }
  };

  const handleLeaveAction = (id: number, action: "Approved" | "Rejected") => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
    
    const request = leaveRequests.find(r => r.id === id);
    if (request) {
      const activity: Activity = {
        id: activities.length + 1,
        user: "HR Manager",
        action: `${action} leave request for ${request.employee}`,
        time: "Just now"
      };
      setActivities([activity, ...activities]);
    }
    playSound("/sounds/click.mp3");
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            HR Portal
          </h1>
          <p className="text-gray-600">Manage employee information, payroll, and benefits</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Leave Requests */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Pending Leave Requests
                </h3>
                <div className="space-y-3">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{request.employee}</p>
                        <p className="text-xs text-gray-600">{request.type} - {request.dates}</p>
                        <p className="text-xs text-gray-500 mt-1">{request.reason}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {request.status === 'Pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleLeaveAction(request.id, 'Approved')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleLeaveAction(request.id, 'Rejected')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : request.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Requests
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Employee Management</h3>
                <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                          placeholder="Enter job position"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddEmployee} className="flex-1">
                          Add Employee
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="mb-4">
                <Input 
                  placeholder="Search employees..." 
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredEmployees.length > 0 ? (
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <Card key={employee.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{employee.name}</p>
                            <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                            <p className="text-xs text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No employees found</p>
                  <p className="text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Payroll Management</h3>
                <Button>Process Payroll</Button>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Payroll processing and management</p>
                <p className="text-sm mt-2">Handle salary calculations, deductions, and payments</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Benefits Administration</h3>
                <Button>Update Benefits</Button>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Employee benefits management</p>
                <p className="text-sm mt-2">Manage health insurance, retirement plans, and other benefits</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
