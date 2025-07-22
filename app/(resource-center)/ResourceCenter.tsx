"use client";

import React from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { useAtom } from "jotai";
import { openWindowAtom } from "@/application/atoms/windowAtoms";
import { playSound } from "@/infrastructure/lib/utils";
import Image from "next/image";

interface ResourceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  appId: string;
}

const resources: ResourceItem[] = [
  {
    id: "hr-portal",
    name: "HR Portal",
    description: "Manage payroll, time off, and benefits",
    icon: "/icons/hr-portal.png",
    appId: "hrPortal",
  },
  {
    id: "it-helpdesk", 
    name: "IT Helpdesk",
    description: "Get tech support and report issues",
    icon: "/icons/it-helpdesk.png",
    appId: "itHelpdesk",
  },
  {
    id: "company-wiki",
    name: "Company Wiki", 
    description: "Company's internal knowledge base",
    icon: "/icons/company-wiki.png",
    appId: "companyWiki",
  },
  {
    id: "design-system",
    name: "Design System",
    description: "Brand colors, fonts, and components",
    icon: "/icons/design-system.png", 
    appId: "designSystem",
  },
];

export const ResourceCenter = () => {
  const [, openWindow] = useAtom(openWindowAtom);

  const handleResourceClick = (resource: ResourceItem) => {
    playSound("/sounds/click.mp3");
    
    const windowInstanceId = `${resource.appId}-instance`;
    
    openWindow({
      id: windowInstanceId,
      appId: resource.appId,
      title: resource.name,
      minSize: { width: 600, height: 500 },
      initialSize: { width: 800, height: 600 },
    });
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resource Center
          </h1>
          <p className="text-gray-600">
            Your gateway to company resources and support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-blue-200"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Image
                      src={resource.icon}
                      alt={resource.name}
                      width={40}
                      height={40}
                      className="filter brightness-0 invert"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {resource.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Open →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact IT support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};
