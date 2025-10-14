import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="bg-white min-h-[5rem] rounded-t-2xl flex items-center px-6 border-b border-[#cecece]">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && item.label.toLowerCase() === 'home' && (
              <Home className="w-4 h-4 text-gray-500 mr-2" />
            )}
            {item.href ? (
              <a href={item.href} className="text-gray-500 hover:text-black">
                {item.label}
              </a>
            ) : (
              <span className="text-black font-bold">{item.label}</span>
            )}
            {index < items.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
