import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import EventMap from './components/EventMap';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Header from './components/Header';
import { Event } from './types';
import { geocodeLocation } from './utils/geocoding';
import { isEventArchived } from './utils/helpers';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmp1P1Nn9S9s2n2kVPBw4_E4HJ80XdNKnhRO62o4OcxUCCw69-pJSQ8IMEChC4LTky5vE2oxso__XX/pub?gid=0&single=true&output=csv';
        
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        if (!csvText.trim()) {
          throw new Error('Otrzymano pustą odpowiedź z Google Sheets');
        }

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }

            const processedEvents = [];
            
            for (const row of results.data) {
              if (!row.data || !row.od || !row.json) continue;
              
              try {
                const eventData = JSON.parse(row.json);
                const coordinates = await geocodeLocation(eventData.location);
                
                if (coordinates) {
                  processedEvents.push({
                    id: row.data + row.od,
                    date: row.data,
                    email: row.od,
                    ...eventData,
                    coordinates,
                    isArchived: isEventArchived(eventData.dateTime)
                  });
                }
              } catch (e) {
                console.error('Failed to parse event:', e);
              }
            }
            
            setEvents(processedEvents);
            setError(null);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Błąd podczas przetwarzania danych');
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Nie udało się pobrać wydarzeń. Spróbuj ponownie później.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    showArchived ? event.isArchived : !event.isArchived
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Ładowanie wydarzeń...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Odśwież
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] overflow-hidden">
      <Header 
        showArchived={showArchived} 
        onToggleArchived={setShowArchived}
        totalEvents={events.length}
        archivedEvents={events.filter(e => e.isArchived).length}
      />

      <div className="grid grid-cols-3 h-[calc(100%-4rem)] overflow-hidden">
        <div className="col-span-1 border-r border-gray-200">
          <EventList
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
          />
        </div>

        <div className="col-span-2 relative">
          <EventMap 
            events={filteredEvents} 
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
          />
          {selectedEvent && (
            <EventDetails 
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;