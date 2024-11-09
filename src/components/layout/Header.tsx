import { Search, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearch } from '../../hooks/useSearch';
import { SearchResults } from '../search/SearchResults';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { NotificationsPopup } from '../notifications/NotificationsPopup';

export function Header() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { results, isLoading, search } = useSearch();

  useOnClickOutside(searchRef, () => setShowResults(false));
  useOnClickOutside(notificationsRef, () => setShowNotifications(false));

  useEffect(() => {
    const fetchOfficeLogo = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) return;

        const { data, error } = await supabase
          .from('offices')
          .select('logo_url')
          .eq('id', officeId)
          .single();

        if (error) throw error;
        setLogoUrl(data.logo_url);
      } catch (err) {
        console.error('Error fetching office logo:', err);
      }
    };

    fetchOfficeLogo();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);
    search(query);
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 lg:left-64">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 max-w-xl relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties, owners, or contracts..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {showResults && (
            <SearchResults
              results={results}
              isLoading={isLoading}
              onClose={() => setShowResults(false)}
            />
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div ref={notificationsRef} className="relative">
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && <NotificationsPopup />}
          </div>
          <Link 
            to="/profile"
            className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors overflow-hidden"
          >
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Office logo" 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">SA</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}