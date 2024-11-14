import React from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, selectedEvent, onEventSelect }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 px-4 h-full flex items-center justify-center">
        <div>
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Brak wydarzeń do wyświetlenia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-2 p-4">
        {events.map(event => (
          <div
            key={event.id}
            className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedEvent?.id === event.id 
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => onEventSelect(event)}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">
                {event.eventName}
              </h3>
              {event.isArchived && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                  Archiwalne
                </span>
              )}
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate">{event.dateTime}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              {event.eventLink && event.eventLink !== "Brak informacji o linku do wydarzenia" && (
                <div className="flex items-center text-blue-600">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">Link do wydarzenia</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;