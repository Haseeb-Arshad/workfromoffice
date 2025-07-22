"use client";

import React, { useState } from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { BookOpen, Search, Book, Tag, MessageCircle, FileText } from "lucide-react";

export const CompanyWiki = () => {
  const [selectedTab, setSelectedTab] = useState("home");

  const trendingTopics = [
    { title: "Project Management Guidelines", author: "John Doe", views: 352, icon: Book },
    { title: "Security Policies", author: "Jane Smith", views: 289, icon: MessageCircle },
    { title: "Annual Review Process", author: "Bob Johnson", views: 245, icon: FileText },
    { title: "Company History & Values", author: "Alice Brown", views: 223, icon: Tag },
  ];

  const recentUpdates = [
    { title: "New Project Templates Available", date: "Mar 15, 2025", modifiedBy: "Tom Wilson" },
    { title: "Updated HR Policies", date: "Mar 14, 2025", modifiedBy: "Lisa Garcia" },
    { title: "Launch of New Branding", date: "Mar 13, 2025", modifiedBy: "Emma Davis" },
  ];

  return (
    <div className="p-6 h-full bg-gradient-to-br from-cyan-50 via-blue-50/30 to-purple-50/20 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-yellow-600" />
            Company Wiki
          </h1>
          <p className="text-gray-600">Find internal guides, policies, and procedures</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent Updates</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome to the Company Wiki</h3>
                <p className="text-gray-600">Learn about our company policies, standards, and practices. Use the search to find specific topics.</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Get Started Guide</h3>
                <div>
                  <Button variant="outline">Read Now</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingTopics.map((topic, index) => {
                const IconComponent = topic.icon;
                return (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 flex-shrink-0 text-yellow-600">
                        <IconComponent className="h-12 w-12" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">{topic.title}</p>
                        <p className="text-sm text-gray-600">by {topic.author}</p>
                        <p className="text-xs text-gray-500">Views: {topic.views}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <div className="space-y-4">
              {recentUpdates.map((update, index) => (
                <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{update.title}</h4>
                      <p className="text-sm text-gray-600">Last modified by {update.modifiedBy}</p>
                    </div>
                    <p className="text-xs text-gray-500">{update.date}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-yellow-600" />
                Search the Wiki
              </h3>
              <Input placeholder="Search for articles, policies, guides..." className="mb-6" />
              <p className="text-center text-gray-500">Enter keywords to find the information you need</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

