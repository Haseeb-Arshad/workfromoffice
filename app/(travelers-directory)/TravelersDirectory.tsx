import React from "react";
import { useAtomValue } from 'jotai';
import { viewModeAtom } from '@/application/atoms/travelersDirectoryAtom';
import { GalleryView } from './components/GalleryView';
import { PassportView } from './components/PassportView';
import { SearchHeader } from './components/SearchHeader';

export const TravelersDirectory = () => {
  const viewMode = useAtomValue(viewModeAtom);
  
  return (
    <div className="h-full w-full flex flex-col bg-stone-50">
      <header className="w-full bg-white text-gray-800 p-4 shadow-sm border-b">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            People
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your team directory</p>
        </div>
      </header>
      {viewMode === 'gallery' && <SearchHeader />}
      <main className="flex-1 w-full">
        {viewMode === 'gallery' ? <GalleryView /> : <PassportView />}
      </main>
    </div>
  );
};

export default TravelersDirectory;
