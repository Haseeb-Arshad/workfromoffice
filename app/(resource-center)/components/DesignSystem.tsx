"use client";

import React from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Palette, Type, LayoutDashboard, Code } from "lucide-react";

export const DesignSystem = () => {
  const brandColors = [
    { name: "Primary", code: "#1D4ED8", bgClass: "bg-blue-600" },
    { name: "Secondary", code: "#9333EA", bgClass: "bg-purple-600" },
    { name: "Accent", code: "#F59E0B", bgClass: "bg-yellow-500" },
    { name: "Background", code: "#F3F4F6", bgClass: "bg-gray-100" },
  ];

  const fonts = [
    { name: "Heading Font", style: "Bold 700", example: "Open Sans" },
    { name: "Body Font", style: "Regular 400", example: "Roboto" },
  ];

  const components = [
    { name: "Buttons", description: "Interactive elements for user actions", icon: Code },
    { name: "Cards", description: "Encapsulated content blocks", icon: LayoutDashboard },
    { name: "Inputs", description: "User data entry fields", icon: Type },
  ];

  return (
    <div className="p-6 h-full bg-gradient-to-br from-pink-50 via-red-50/30 to-orange-50/20 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Palette className="h-8 w-8 text-green-600" />
            Design System
          </h1>
          <p className="text-gray-600">Explore the brand colors, typography, and components library</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Brand Colors</h3>
            <div className="space-y-4">
              {brandColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded ${color.bgClass}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{color.name}: {color.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fonts</h3>
            <div className="space-y-4">
              {fonts.map((font, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-800">{font.example}</p>
                    <p className="text-sm text-gray-600">{font.style} - {font.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {components.map((component, index) => {
            const IconComponent = component.icon;
            return (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{component.name}</h4>
                    <p className="text-gray-600">{component.description}</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">View {component.name}</Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
