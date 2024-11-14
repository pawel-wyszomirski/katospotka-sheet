import React from 'react';
import { Calendar, MapPin, ExternalLink, User, X, Clock } from 'lucide-react';
import { Event } from '../types';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  return (
    <div className="event-details-overlay">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{event.eventName}</h3>
            {event.isArchived && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Wydarzenie archiwalne
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Zamknij szczegóły"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Data</h4>
                <p className="text-gray-600">{event.dateTime}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Lokalizacja</h4>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Organizator</h4>
                <p className="text-gray-600">{event.organizer}</p>
              </div>
            </div>
            
            {event.eventLink && event.eventLink !== "Brak informacji o linku do wydarzenia" && (
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:underline"
              >
                <ExternalLink className="w-5 h-5 flex-shrink-0" />
                <span>Przejdź do strony wydarzenia</span>
              </a>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Opis wydarzenia</h4>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>
            </div>
            
            {event.registration && event.registration !== "Brak informacji o konieczności rejestracji" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Informacje o rejestracji</h4>
                <p className="text-blue-700">{event.registration}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;