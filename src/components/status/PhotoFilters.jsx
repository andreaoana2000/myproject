
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Sun, Moon, Zap, Heart, Star, Sparkles } from 'lucide-react';

export default function PhotoFilters({ selectedFilter, onFilterChange }) {
  const filters = [
    { id: 'none', name: 'Original', icon: Sun, style: 'filter-none' },
    { id: 'sepia', name: 'Vintage', icon: Moon, style: 'sepia(100%)' },
    { id: 'grayscale', name: 'B&W', icon: Zap, style: 'grayscale(100%)' },
    { id: 'blur', name: 'Dreamy', icon: Heart, style: 'blur(1px)' },
    { id: 'brightness', name: 'Bright', icon: Star, style: 'brightness(120%)' },
    { id: 'contrast', name: 'Pop', icon: Sparkles, style: 'contrast(120%)' }
  ];

  return (
    <div>
      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filters
      </label>
      <div className="grid grid-cols-3 gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className="flex items-center gap-1"
            >
              <Icon className="w-3 h-3" />
              <span className="text-xs">{filter.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
