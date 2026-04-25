const mongoose = require('mongoose');
const Facility = require('./models/Facility');
require('dotenv').config();

const facilityData = [
  {
    title: "Science Laboratory",
    description: "State-of-the-art science laboratory equipped with modern instruments and safety equipment for physics, chemistry, and biology experiments.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400",
    features: ["Microscopes", "Chemical Fume Hoods", "Digital Scales", "Safety Equipment", "Interactive Smart Board"],
    category: "academic",
    priority: 9,
    isActive: true,
    displayOnHomepage: true,
    capacity: "30 students",
    location: "Ground Floor, Block A",
    availability: "available",
    contactInfo: "lab@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Computer Lab",
    description: "Modern computer laboratory with high-speed internet and latest software for programming, design, and research activities.",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
    features: ["30 Desktop Computers", "High-Speed Internet", "Programming Software", "Design Tools", "Projector"],
    category: "technology",
    priority: 8,
    isActive: true,
    displayOnHomepage: true,
    capacity: "30 students",
    location: "First Floor, Block B",
    availability: "available",
    contactInfo: "it@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Library",
    description: "Well-stocked library with thousands of books, journals, and digital resources. Quiet study areas and group discussion rooms available.",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    features: ["10,000+ Books", "Digital Resources", "Study Rooms", "Reading Areas", "Research Assistance"],
    category: "academic",
    priority: 9,
    isActive: true,
    displayOnHomepage: true,
    capacity: "100 students",
    location: "Ground Floor, Central Block",
    availability: "available",
    contactInfo: "library@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Sports Complex",
    description: "Multi-purpose sports complex with basketball court, badminton courts, and indoor games facility.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    features: ["Basketball Court", "Badminton Courts", "Table Tennis", "Volleyball Court", "Changing Rooms"],
    category: "sports",
    priority: 7,
    isActive: true,
    displayOnHomepage: true,
    capacity: "200 students",
    location: "Sports Building",
    availability: "available",
    contactInfo: "sports@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Art & Craft Room",
    description: "Creative space for art and craft activities with all necessary materials and tools for artistic expression.",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
    features: ["Art Supplies", "Craft Materials", "Drawing Tables", "Storage Space", "Display Boards"],
    category: "recreation",
    priority: 6,
    isActive: true,
    displayOnHomepage: true,
    capacity: "25 students",
    location: "Second Floor, Block A",
    availability: "available",
    contactInfo: "arts@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Music Room",
    description: "Soundproof music room with various musical instruments and recording equipment for music education and practice.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    features: ["Piano", "Guitar", "Drums", "Microphones", "Sound System", "Recording Equipment"],
    category: "recreation",
    priority: 5,
    isActive: true,
    displayOnHomepage: true,
    capacity: "20 students",
    location: "Ground Floor, Block C",
    availability: "available",
    contactInfo: "music@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Cafeteria",
    description: "Clean and hygienic cafeteria serving nutritious meals and snacks. Spacious dining area with modern kitchen facilities.",
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400",
    features: ["Nutritious Meals", "Clean Kitchen", "Dining Tables", "Hygiene Standards", "Variety Menu"],
    category: "infrastructure",
    priority: 8,
    isActive: true,
    displayOnHomepage: true,
    capacity: "300 students",
    location: "Ground Floor, Main Building",
    availability: "available",
    contactInfo: "cafeteria@school.edu",
    createdBy: "Admin"
  },
  {
    title: "Auditorium",
    description: "Large auditorium for assemblies, cultural programs, and events with modern sound and lighting systems.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    features: ["500 Seating", "Sound System", "Stage Lighting", "Projection Screen", "Green Room"],
    category: "infrastructure",
    priority: 7,
    isActive: true,
    displayOnHomepage: true,
    capacity: "500 people",
    location: "Separate Building",
    availability: "available",
    contactInfo: "events@school.edu",
    createdBy: "Admin"
  }
];

const seedFacilities = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected to MongoDB');
    console.log('Clearing existing facilities...');
    await Facility.deleteMany({});
    
    console.log('Inserting facility data...');
    await Facility.insertMany(facilityData);
    
    console.log('✅ Facility data seeded successfully!');
    console.log(`Inserted ${facilityData.length} facilities`);
    
    // Display summary
    const facilities = await Facility.find({});
    console.log('\\nFacilities Summary:');
    facilities.forEach((facility, index) => {
      console.log(`${index + 1}. ${facility.title} - ${facility.category} (Priority: ${facility.priority})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding facility data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\\nDisconnected from MongoDB');
  }
};

// Run the seeding function
seedFacilities();