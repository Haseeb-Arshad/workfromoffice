"use client";

import React, { useState } from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { 
  Wrench, 
  Monitor, 
  Wifi, 
  Shield, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Send
} from "lucide-react";
import { playSound } from "@/infrastructure/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  issueType: string;
  priority: string;
  status: string;
  submittedAt: string;
}

export const ITHelpdesk = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", issueType: "", priority: "Medium" });
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "#1234", subject: "Laptop keyboard not working", description: "Keys are not responding", issueType: "Hardware Problem", priority: "High", status: "In Progress", submittedAt: "2 hours ago" },
    { id: "#1233", subject: "Cannot access shared drive", description: "Getting permission error", issueType: "Network Connectivity", priority: "Medium", status: "Resolved", submittedAt: "4 hours ago" },
    { id: "#1232", subject: "Email sync issues", description: "Emails not syncing properly", issueType: "Email & Communication", priority: "Low", status: "Open", submittedAt: "6 hours ago" },
  ]);

  const stats = [
    { label: "Open Tickets", value: "12", icon: AlertTriangle, color: "text-orange-600" },
    { label: "Resolved Today", value: "8", icon: CheckCircle, color: "text-green-600" },
    { label: "Avg Response", value: "2.5h", icon: Clock, color: "text-blue-600" },
    { label: "System Status", value: "All OK", icon: Monitor, color: "text-green-600" },
  ];

  const commonIssues = [
    { 
      title: "Password Reset", 
      description: "Reset your account password",
      icon: Shield,
      category: "Security"
    },
    { 
      title: "Software Installation", 
      description: "Request new software installation",
      icon: Monitor,
      category: "Software"
    },
    { 
      title: "WiFi Connection", 
      description: "Troubleshoot network connectivity",
      icon: Wifi,
      category: "Network"
    },
    { 
      title: "Hardware Issues", 
      description: "Report hardware problems",
      icon: Wrench,
      category: "Hardware"
    },
  ];

  const recentTickets = [
    { id: "#1234", issue: "Laptop keyboard not working", status: "In Progress", priority: "High", time: "2 hours ago" },
    { id: "#1233", issue: "Cannot access shared drive", status: "Resolved", priority: "Medium", time: "4 hours ago" },
    { id: "#1232", issue: "Email sync issues", status: "Open", priority: "Low", time: "6 hours ago" },
    { id: "#1231", issue: "Printer not responding", status: "Resolved", priority: "Medium", time: "1 day ago" },
  ];

  const systemStatus = [
    { service: "Email Server", status: "Operational", uptime: "99.9%" },
    { service: "File Server", status: "Operational", uptime: "99.8%" },
    { service: "WiFi Network", status: "Operational", uptime: "99.7%" },
    { service: "VPN Service", status: "Maintenance", uptime: "98.2%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational": return "text-green-600 bg-green-100";
      case "maintenance": return "text-yellow-600 bg-yellow-100";
      case "down": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "text-green-600 bg-green-100";
      case "in progress": return "text-blue-600 bg-blue-100";
      case "open": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleSubmitTicket = () => {
    if (newTicket.subject && newTicket.description && newTicket.issueType) {
      const ticket: Ticket = {
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        subject: newTicket.subject,
        description: newTicket.description,
        issueType: newTicket.issueType,
        priority: newTicket.priority,
        status: "Open",
        submittedAt: "Just now"
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ subject: "", description: "", issueType: "", priority: "Medium" });
      setSelectedTab("tickets");
      playSound("/sounds/click.mp3");
    }
  };

  const handleCommonIssueClick = (issue: any) => {
    setNewTicket({ 
      subject: issue.title, 
      description: issue.description, 
      issueType: issue.category === "Security" ? "Security & Access" : 
                 issue.category === "Network" ? "Network Connectivity" : 
                 issue.category === "Software" ? "Software Issue" : "Hardware Problem",
      priority: "Medium" 
    });
    setSelectedTab("submit");
    playSound("/sounds/click.mp3");
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-yellow-50 via-green-50/30 to-blue-50/20 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            IT Helpdesk
          </h1>
          <p className="text-gray-600">Get technical support and report IT issues</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="submit">Submit Ticket</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
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
              {/* Common Issues */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Common Issues
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {commonIssues.map((issue, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => handleCommonIssueClick(issue)}
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <issue.icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{issue.title}</p>
                          <p className="text-sm text-gray-600">{issue.description}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Recent Tickets */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Tickets
                </h3>
                <div className="space-y-4">
                  {recentTickets.map((ticket, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-800">{ticket.id}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTicketStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{ticket.issue}</p>
                        <p className="text-xs text-gray-500">{ticket.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Tickets
                </Button>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Emergency IT Support</p>
                    <p className="text-sm text-red-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">IT Support Email</p>
                    <p className="text-sm text-blue-600">support@company.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="submit" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Submit New Ticket</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={newTicket.issueType} onValueChange={(value) => setNewTicket({ ...newTicket, issueType: value })}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select issue type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hardware Problem">Hardware Problem</SelectItem>
                      <SelectItem value="Software Issue">Software Issue</SelectItem>
                      <SelectItem value="Network Connectivity">Network Connectivity</SelectItem>
                      <SelectItem value="Security & Access">Security & Access</SelectItem>
                      <SelectItem value="Email & Communication">Email & Communication</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief description of the issue"
                    className="mt-1"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description"
                    className="w-full p-2 border rounded-md mt-1 h-32"
                    placeholder="Detailed description of the issue and any error messages..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSubmitTicket}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">My Tickets</h3>
                <Button>Submit New Ticket</Button>
              </div>
              
              <div className="mb-4">
                <Input placeholder="Search tickets..." className="max-w-sm" />
              </div>

              <div className="text-center py-12 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Your support tickets</p>
                <p className="text-sm mt-2">View status and updates on your submitted tickets</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                System Status
              </h3>
              
              <div className="space-y-4">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{system.service}</p>
                      <p className="text-sm text-gray-600">Uptime: {system.uptime}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  All critical systems are operational. Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
