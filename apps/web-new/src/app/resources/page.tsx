"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
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
  severity: 'all' | 'mild' | 'moderate' | 'severe';
  tags: string[];
  views: number;
  likes: number;
}

// Mock data for Indian Youth Mental Wellness
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Board Exam Stress: Coping Strategies for Indian Students',
    description: 'Practical techniques to manage board exam anxiety, family pressure, and academic stress. Specifically designed for Indian high school students.',
    type: 'video',
    category: 'Academic Stress',
    language: 'en',
    duration: 480, // 8 minutes
    thumbnailUrl: '/api/placeholder/video-thumb-1',
    severity: 'moderate',
    tags: ['board-exams', 'academic-stress', 'indian-students', 'anxiety'],
    views: 2456,
    likes: 189
  },
  {
    id: '2',
    title: 'Career Confusion? Finding Your Path in India',
    description: 'Navigate career choices, family expectations vs personal dreams, and the pressure of competitive exams in Indian context.',
    type: 'guide',
    category: 'Career Guidance',
    language: 'en',
    duration: 600, // 10 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-1',
    severity: 'mild',
    tags: ['career', 'family-pressure', 'competitive-exams', 'dreams'],
    views: 1823,
    likes: 145
  },
  {
    id: '3',
    title: 'Pranayama for Mental Peace (प्राणायाम मानसिक शांति के लिए)',
    description: 'Traditional Indian breathing techniques combined with modern mindfulness for young adults dealing with stress and anxiety.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'hi',
    duration: 900, // 15 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-1',
    severity: 'all',
    tags: ['pranayama', 'breathing', 'traditional', 'anxiety-relief'],
    views: 3421,
    likes: 267
  },
  {
    id: '4',
    title: 'Understanding Depression in Tamil Culture (தமிழ் கலாச்சாரத்தில் மனச்சோர்வு)',
    description: 'Breaking stigma around depression in Tamil families. Learn to recognize symptoms and seek help while respecting cultural values.',
    type: 'video',
    category: 'Depression Support',
    language: 'ta',
    duration: 720, // 12 minutes
    thumbnailUrl: '/api/placeholder/video-thumb-2',
    severity: 'moderate',
    tags: ['depression', 'tamil', 'stigma', 'family-support'],
    views: 1567,
    likes: 134
  },
  {
    id: '5',
    title: 'College Transition: From Home to Hostel Life',
    description: 'Dealing with homesickness, making new friends, and adapting to independence during college years in India.',
    type: 'guide',
    category: 'Life Transitions',
    language: 'en',
    duration: 420, // 7 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-2',
    severity: 'mild',
    tags: ['college', 'independence', 'homesickness', 'friendship'],
    views: 2189,
    likes: 178
  },
  {
    id: '6',
    title: 'Social Media & Mental Health for Indian Youth',
    description: 'Managing Instagram pressure, comparison trap, and building healthy digital habits for better mental wellness.',
    type: 'video',
    category: 'Digital Wellness',
    language: 'en',
    duration: 540, // 9 minutes
    thumbnailUrl: '/api/placeholder/video-thumb-3',
    severity: 'mild',
    tags: ['social-media', 'comparison', 'digital-wellness', 'self-esteem'],
    views: 4235,
    likes: 342
  },
  {
    id: '7',
    title: 'Relationship Anxiety in Indian Context',
    description: 'Navigating romantic relationships, family approval, and cultural expectations while maintaining your mental health.',
    type: 'guide',
    category: 'Relationships',
    language: 'en',
    duration: 480, // 8 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-3',
    severity: 'moderate',
    tags: ['relationships', 'family-approval', 'dating', 'cultural-expectations'],
    views: 1789,
    likes: 156
  },
  {
    id: '8',
    title: 'Job Interview Confidence for Indian Freshers',
    description: 'Overcoming imposter syndrome, building confidence, and managing pre-interview anxiety for first-time job seekers.',
    type: 'video',
    category: 'Career Guidance',
    language: 'en',
    duration: 600, // 10 minutes
    thumbnailUrl: '/api/placeholder/video-thumb-4',
    severity: 'mild',
    tags: ['job-interviews', 'confidence', 'imposter-syndrome', 'freshers'],
    views: 2934,
    likes: 218
  },
  {
    id: '9',
    title: 'Meditation in Bengali (বাংলায় ধ্যান)',
    description: 'Guided meditation session in Bengali for stress relief and emotional balance, incorporating Bengali cultural elements.',
    type: 'audio',
    category: 'Mindfulness & Meditation',
    language: 'bn',
    duration: 780, // 13 minutes
    thumbnailUrl: '/api/placeholder/audio-thumb-2',
    severity: 'all',
    tags: ['meditation', 'bengali', 'stress-relief', 'emotional-balance'],
    views: 1456,
    likes: 98
  },
  {
    id: '10',
    title: 'Family Pressure & Mental Health: A Youth Guide',
    description: 'Balancing family expectations with personal mental wellness. Learn healthy communication and boundary-setting techniques.',
    type: 'guide',
    category: 'Family Dynamics',
    language: 'en',
    duration: 660, // 11 minutes read
    thumbnailUrl: '/api/placeholder/guide-thumb-4',
    severity: 'moderate',
    tags: ['family-pressure', 'boundaries', 'communication', 'expectations'],
    views: 3124,
    likes: 276
  }
];

const CATEGORIES = [
  'All Categories',
  'Academic Stress',
  'Career Guidance', 
  'Mindfulness & Meditation',
  'Depression Support',
  'Life Transitions',
  'Digital Wellness',
  'Relationships',
  'Family Dynamics'
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
  const { data: session } = useSession();
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