"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlayIcon, 
  BookOpenIcon, 
  SpeakerWaveIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'guide';
  category: string;
  language: string;
  duration?: number;
  thumbnailUrl?: string;
  url: string; // Add actual URL for the resource
  severity: 'all' | 'mild' | 'moderate' | 'severe';
  tags: string[];
  views: number;
  likes: number;
}

// Mock data for Indian Youth Mental Wellness
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'TherapyRoute India - State-wise Mental Health Resources',
    description: 'Comprehensive directory of mental health resources across Indian states including Assam, Bengaluru, Chennai, Goa, Gujarat, Kerala, Kolkata, Mumbai, New Delhi, Pune with organizations, helplines, and counseling services.',
    type: 'guide',
    category: 'Mental Health Resources',
    language: 'en',
    duration: 600, // 10 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-1',
    url: 'https://www.therapyroute.com/article/free-mental-health-resources-in-india-by-therapyroute',
    severity: 'all',
    tags: ['state-wise', 'helplines', 'counseling', 'organizations'],
    views: 2456,
    likes: 189
  },
  {
    id: '2',
    title: 'National Tele Mental Health Programme (Tele MANAS)',
    description: 'Government of India\'s 24/7 toll-free helpline (14416) providing tele-counselling, psychotherapy, psychiatric consultation in 20+ languages across India.',
    type: 'guide',
    category: 'Government Resources',
    language: 'en',
    duration: 300, // 5 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-2',
    url: 'https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=153277&ModuleId=3',
    severity: 'all',
    tags: ['government', 'helpline', 'multilingual', 'tele-counseling'],
    views: 3421,
    likes: 267
  },
  {
    id: '3',
    title: 'Live Love Laugh Foundation - Mental Health Helplines',
    description: 'Mental health NGO with awareness campaigns and helpline services in multiple Indian languages for crisis support and guidance.',
    type: 'guide',
    category: 'NGO Resources',
    language: 'en',
    duration: 240, // 4 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-3',
    url: 'https://www.thelivelovelaughfoundation.org/find-help/helplines',
    severity: 'moderate',
    tags: ['ngo', 'helplines', 'crisis-support', 'multilingual'],
    views: 1823,
    likes: 145
  },
  {
    id: '4',
    title: 'Guided Meditation in Hindi by Sri Sri Ravi Shankar',
    description: 'Deep relaxation and stress relief meditation session in Hindi for 22 minutes. Perfect for beginners and experienced practitioners.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'hi',
    duration: 1320, // 22 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-1',
    url: 'https://www.youtube.com/watch?v=dD63eGlJd2A',
    severity: 'all',
    tags: ['hindi', 'meditation', 'stress-relief', 'sri-sri-ravi-shankar'],
    views: 4235,
    likes: 342
  },
  {
    id: '5',
    title: 'Amaha - Online Therapy & Psychiatry Platform',
    description: 'Professional online counseling and psychiatry services available across India with qualified therapists and psychiatrists.',
    type: 'guide',
    category: 'Professional Services',
    language: 'en',
    duration: 360, // 6 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-4',
    url: 'https://www.amahahealth.com',
    severity: 'moderate',
    tags: ['online-therapy', 'psychiatry', 'professional', 'counseling'],
    views: 2189,
    likes: 178
  },
  {
    id: '6',
    title: '10-Minute Guided Meditation for Stress Relief',
    description: 'Quick stress relief meditation session suitable for beginners. Perfect for daily practice and immediate relaxation.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'en',
    duration: 600, // 10 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-2',
    url: 'https://www.youtube.com/watch?v=lS0kcSNlULw',
    severity: 'all',
    tags: ['meditation', 'stress-relief', 'beginners', 'headspace'],
    views: 5432,
    likes: 423
  },
  {
    id: '7',
    title: 'Center for Mental Health India',
    description: 'Online and offline counseling services for individuals, couples, and families. Professional psychological therapies across various age groups.',
    type: 'guide',
    category: 'Professional Services',
    language: 'en',
    duration: 480, // 8 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-5',
    url: 'https://www.centerformentalhealth.in',
    severity: 'moderate',
    tags: ['counseling', 'therapy', 'family', 'professional'],
    views: 1789,
    likes: 156
  },
  {
    id: '8',
    title: '5-Minute Quick Meditation for Instant Relief',
    description: 'Short meditation session perfect for busy schedules. Provides instant stress relief and mindfulness in just 5 minutes.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'en',
    duration: 300, // 5 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-3',
    url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    severity: 'all',
    tags: ['quick-meditation', 'stress-relief', 'mindfulness', 'busy-schedule'],
    views: 3124,
    likes: 276
  },
  {
    id: '9',
    title: 'Hindi Meditation for Stress Relief (15 minutes)',
    description: 'Guided mindfulness meditation in Hindi by Shivangi Desai for stress relief and anxiety management. Suitable for Hindi speakers.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'hi',
    duration: 900, // 15 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-4',
    url: 'https://www.youtube.com/watch?v=2ntenE9Fn5c',
    severity: 'mild',
    tags: ['hindi', 'stress-relief', 'anxiety', 'mindfulness'],
    views: 2934,
    likes: 218
  },
  {
    id: '10',
    title: 'WHO India Mental Health Resources',
    description: 'World Health Organization\'s comprehensive overview of mental health in India including legal framework and Mental Healthcare Act, 2017.',
    type: 'guide',
    category: 'Government Resources',
    language: 'en',
    duration: 720, // 12 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-6',
    url: 'https://www.who.int/india/health-topics/mental-health',
    severity: 'all',
    tags: ['who', 'government', 'legal-framework', 'healthcare-act'],
    views: 1567,
    likes: 134
  },
  {
    id: '11',
    title: 'Brahma Kumaris Guided Meditation Audio Collection',
    description: 'Collection of guided meditations in Hindi and English including soul sustenance, daily affirmations, and spiritual healing.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'hi',
    duration: 1200, // 20 minutes average
    thumbnailUrl: '/api/placeholder/audio-thumb-5',
    url: 'https://www.brahmakumaris.com/audio/guided-meditations/',
    severity: 'all',
    tags: ['brahma-kumaris', 'spiritual', 'hindi', 'guided-meditation'],
    views: 1456,
    likes: 98
  },
  {
    id: '12',
    title: 'Idanim - Free Meditation App (Hindi & English)',
    description: '100% free meditation app with daily live sessions and guided meditations in Hindi and English. No subscription required.',
    type: 'guide',
    category: 'Mobile Apps',
    language: 'hi',
    duration: 180, // 3 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-7',
    url: 'https://www.idanim.com',
    severity: 'all',
    tags: ['app', 'free', 'hindi', 'live-sessions'],
    views: 4128,
    likes: 387
  }
];

const CATEGORIES = [
  'All Categories',
  'Mental Health Resources',
  'Government Resources', 
  'NGO Resources',
  'Professional Services',
  'Mindfulness & Meditation',
  'Mobile Apps'
];

const LANGUAGES = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' }
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(resource => resource.language === selectedLanguage);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, selectedLanguage, selectedType, resources]);

  // Handle resource click to open in new tab
  const handleResourceClick = (resource: Resource) => {
    // Open the resource URL in a new tab
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    
    // Optionally update view count (in a real app, this would be an API call)
    setResources(prevResources => 
      prevResources.map(r => 
        r.id === resource.id 
          ? { ...r, views: r.views + 1 }
          : r
      )
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayIcon className="w-5 h-5" />;
      case 'audio': return <SpeakerWaveIcon className="w-5 h-5" />;
      case 'guide': return <BookOpenIcon className="w-5 h-5" />;
      default: return <BookOpenIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'guide': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-700';
      case 'moderate': return 'bg-orange-100 text-orange-700';
      case 'severe': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getLanguageName = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mental Wellness Resources
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Psychoeducational content in regional languages
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              Explore our comprehensive library of videos, audio guides, and articles designed to support your mental wellness journey. 
              All content is culturally relevant and available in multiple regional languages.
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="video">Videos</option>
                      <option value="audio">Audio</option>
                      <option value="guide">Guides</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleResourceClick(resource)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Thumbnail/Header */}
              <div className={`h-40 bg-gradient-to-br ${
                resource.type === 'video' ? 'from-red-400 to-red-600' :
                resource.type === 'audio' ? 'from-green-400 to-green-600' :
                'from-blue-400 to-blue-600'
              } flex items-center justify-center relative`}>
                <div className="text-white text-4xl">
                  {getTypeIcon(resource.type)}
                </div>
                {resource.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {formatDuration(resource.duration)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Type */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2 flex-1">
                    {resource.title}
                  </h3>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* Category and Language */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {resource.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {getLanguageName(resource.language)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(resource.severity)}`}>
                    {resource.severity === 'all' ? 'All levels' : resource.severity}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {resource.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      {resource.likes}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  {resource.type === 'video' && (
                    <>
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Watch Video
                    </>
                  )}
                  {resource.type === 'audio' && (
                    <>
                      <SpeakerWaveIcon className="w-4 h-4 mr-2" />
                      Listen Now
                    </>
                  )}
                  {resource.type === 'guide' && (
                    <>
                      <BookOpenIcon className="w-4 h-4 mr-2" />
                      Read Guide
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedLanguage('all');
                setSelectedType('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            About Our Resources
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Educational Videos</h3>
              <p className="text-gray-600 text-sm">
                Expert-created videos covering mental health topics, coping strategies, and wellness techniques in multiple languages.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SpeakerWaveIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Guided Audio</h3>
              <p className="text-gray-600 text-sm">
                Meditation sessions, breathing exercises, and relaxation techniques designed to support your mental wellness journey.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comprehensive Guides</h3>
              <p className="text-gray-600 text-sm">
                In-depth articles and guides providing practical strategies and insights for managing mental health challenges.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}