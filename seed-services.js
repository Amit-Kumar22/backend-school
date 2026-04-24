const mongoose = require('mongoose');
require('dotenv').config();

// Service Schema - same as model
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.model('Service', serviceSchema);

// Sample services data
const sampleServices = [
  {
    title: "Smart Classrooms",
    description: "Interactive digital learning environment with modern technology and multimedia tools.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=500",
    isActive: true
  },
  {
    title: "Science Laboratory",
    description: "Well-equipped labs for physics, chemistry, and biology experiments.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
    isActive: true
  },
  {
    title: "Library & Resource Center",
    description: "Extensive collection of books, digital resources, and quiet study spaces.",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
    isActive: true
  },
  {
    title: "Sports Complex",
    description: "Indoor and outdoor sports facilities including playground and gymnasium.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    isActive: true
  }
];

async function seedServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️ Cleared existing services');

    // Insert sample services
    const result = await Service.insertMany(sampleServices);
    console.log(`✅ Created ${result.length} sample services:`);
    
    result.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title}`);
    });

    // Close connection
    await mongoose.disconnect();
    console.log('👋 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

// Run the seed function
seedServices();