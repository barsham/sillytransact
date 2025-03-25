
import { useState } from 'react';
import { mockConfigOptions, ConfigOption } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import ConfigurationPanel from '@/components/ConfigurationPanel';
import { toast } from 'sonner';
import { Settings, Save, Search, Filter } from 'lucide-react';

const Configuration = () => {
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>(mockConfigOptions);
  const [filteredOptions, setFilteredOptions] = useState<ConfigOption[]>(mockConfigOptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    filterOptions(value, categoryFilter);
  };

  const handleCategoryFilter = (category: string | null) => {
    const newCategory = category === categoryFilter ? null : category;
    setCategoryFilter(newCategory);
    
    filterOptions(searchTerm, newCategory);
  };

  const filterOptions = (search: string, category: string | null) => {
    let filtered = [...configOptions];
    
    if (search) {
      filtered = filtered.filter(
        opt => 
          opt.name.toLowerCase().includes(search.toLowerCase()) ||
          opt.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(opt => opt.category === category);
    }
    
    setFilteredOptions(filtered);
  };

  const handleConfigUpdate = (id: string, value: string) => {
    const updatedOptions = configOptions.map(opt => 
      opt.id === id ? { ...opt, value } : opt
    );
    
    setConfigOptions(updatedOptions);
    setFilteredOptions(
      filteredOptions.map(opt => opt.id === id ? { ...opt, value } : opt)
    );
    
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Simulate saving to server
    setTimeout(() => {
      toast.success('Configuration saved successfully');
      setHasChanges(false);
    }, 1000);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'network':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'security':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'processing':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'monitoring':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'notification':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const uniqueCategories = Array.from(new Set(configOptions.map(opt => opt.category)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pl-[16rem] p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Configuration</h1>
              <p className="text-muted-foreground">Manage system settings and preferences</p>
            </div>
            
            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            )}
          </header>
          
          <div className="glass-card p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search configuration..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background/50 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  
                  {uniqueCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-2 py-1 text-xs rounded-full border transition-all-200 ${
                        categoryFilter === category 
                          ? getCategoryBadgeClass(category) 
                          : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  
                  {categoryFilter && (
                    <button
                      onClick={() => handleCategoryFilter(null)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-all-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptions.map(config => (
              <ConfigurationPanel 
                key={config.id} 
                config={config}
                onUpdate={handleConfigUpdate}
              />
            ))}
          </div>
          
          {filteredOptions.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No settings found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                We couldn't find any configuration options matching your search or filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter(null);
                  setFilteredOptions(configOptions);
                }}
                className="text-sm text-primary hover:text-primary/80 transition-all-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuration;
