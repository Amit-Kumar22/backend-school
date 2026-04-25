require('dotenv').config();
const mongoose = require('mongoose');
const ImportantNotice = require('./models/ImportantNotice');

const seedImportantNotices = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ImportantNotice.deleteMany({});
    console.log('Cleared existing important notices');

    // Sample important notices
    const sampleNotices = [
      {
        title: 'Annual Sports Day - March 2026',
        description: 'Our annual sports event is scheduled for March 15, 2026. All students and parents are invited to participate.',
        link: '/events/sports-day',
        linkText: 'View Details',
        priority: 'high',
        type: 'info',
        isActive: true,
        displayOnHomepage: true,
        showAsTicker: false
      },
      {
        title: 'Important: Fee Submission Deadline',
        description: 'Last date for fee submission is April 30, 2026. Late fees will be applicable after the deadline.',
        link: '/admissions/fees',
        linkText: 'Pay Now',
        priority: 'urgent',
        type: 'warning',
        isActive: true,
        displayOnHomepage: true,
        showAsTicker: true
      },
      {
        title: 'New Library Books Available',
        description: 'Over 500 new books have been added to our school library. Students can now issue these books.',
        priority: 'medium',
        type: 'success',
        isActive: true,
        displayOnHomepage: true,
        showAsTicker: false
      },
      {
        title: 'School Closed - Holiday Notice',
        description: 'School will remain closed on April 26, 2026 due to state holiday. Regular classes will resume on April 27.',
        priority: 'high',
        type: 'alert',
        isActive: true,
        displayOnHomepage: true,
        showAsTicker: true
      }
    ];

    // Insert sample data
    await ImportantNotice.insertMany(sampleNotices);
    console.log('✅ Sample important notices created successfully!');

    // Display created notices
    const notices = await ImportantNotice.find({});
    console.log(`\nCreated ${notices.length} important notices:`);
    notices.forEach((notice, index) => {
      console.log(`${index + 1}. ${notice.title} (${notice.priority} - ${notice.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding important notices:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the seeding
seedImportantNotices();