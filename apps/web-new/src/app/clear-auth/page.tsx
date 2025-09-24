'use client';

export default function ClearAuthPage() {
  const handleClearAuth = () => {
    // Clear local storage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    alert('Auth data cleared! Please refresh the page.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Clear Authentication Data</h1>
      <button 
        onClick={handleClearAuth}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear All Auth Data
      </button>
      <p className="mt-4 text-gray-600">
        This will clear all local storage, session storage, and cookies.
      </p>
    </div>
  );
}