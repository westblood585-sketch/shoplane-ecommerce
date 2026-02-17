import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();
  
  // Parse URL to create breadcrumb items
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Home', path: '/' }
    ];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format name from URL
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name: decodeURIComponent(name),
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  // Don't show breadcrumb on home page
  if (breadcrumbs.length === 1) {
    return null;
  }
  
  // JSON-LD Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `http://localhost:5178${crumb.path}` // Will be replaced with production URL
    }))
  };
  
  return (
    <>
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-3 mb-6">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                
                {index === breadcrumbs.length - 1 ? (
                  // Current page (not a link)
                  <span className="text-gray-700 dark:text-dark-text font-medium">
                    {crumb.name}
                  </span>
                ) : (
                  // Link to parent page
                  <Link
                    to={crumb.path}
                    className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    {crumb.name === 'Home' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      crumb.name
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
