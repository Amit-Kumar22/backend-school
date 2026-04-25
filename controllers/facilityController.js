const Facility = require('../models/Facility');

// @desc    Get all facilities
// @route   GET /api/facilities
exports.getAllFacilities = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      isActive, 
      displayOnHomepage 
    } = req.query;

    const filter = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (displayOnHomepage !== undefined) filter.displayOnHomepage = displayOnHomepage === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const facilities = await Facility.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Facility.countDocuments(filter);
    
    res.json({
      success: true,
      count: facilities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: facilities
    });
  } catch (error) {
    console.error('Get all facilities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get active facilities for homepage
// @route   GET /api/facilities/active
exports.getActiveFacilities = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const facilities = await Facility.getActiveForHomepage(parseInt(limit));
    
    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    console.error('Get active facilities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get facilities by category
// @route   GET /api/facilities/category/:category
exports.getFacilitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const facilities = await Facility.getByCategory(category);
    
    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    console.error('Get facilities by category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single facility
// @route   GET /api/facilities/:id
exports.getFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    // Increment view count
    await facility.incrementViews();

    res.json({
      success: true,
      data: facility
    });
  } catch (error) {
    console.error('Get facility error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create facility
// @route   POST /api/facilities
exports.createFacility = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageUrl,
      features,
      category, 
      priority,
      isActive, 
      displayOnHomepage,
      capacity,
      location,
      availability,
      contactInfo,
      createdBy 
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const facility = await Facility.create({
      title,
      description,
      imageUrl: imageUrl || '',
      features: features || [],
      category: category || 'other',
      priority: priority || 0,
      isActive: isActive !== undefined ? isActive : true,
      displayOnHomepage: displayOnHomepage !== undefined ? displayOnHomepage : true,
      capacity: capacity || '',
      location: location || '',
      availability: availability || 'available',
      contactInfo: contactInfo || '',
      createdBy: createdBy || 'Admin'
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facility
    });
  } catch (error) {
    console.error('Create facility error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
exports.updateFacility = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageUrl,
      features,
      category, 
      priority,
      isActive, 
      displayOnHomepage,
      capacity,
      location,
      availability,
      contactInfo
    } = req.body;

    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        imageUrl,
        features,
        category,
        priority,
        isActive,
        displayOnHomepage,
        capacity,
        location,
        availability,
        contactInfo,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: facility
    });
  } catch (error) {
    console.error('Update facility error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    await Facility.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    console.error('Delete facility error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/facilities/:id/toggle-active
exports.toggleActiveStatus = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    facility.isActive = !facility.isActive;
    facility.updatedAt = Date.now();
    await facility.save();

    res.json({
      success: true,
      message: `Facility ${facility.isActive ? 'activated' : 'deactivated'} successfully`,
      data: facility
    });
  } catch (error) {
    console.error('Toggle active status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get facility categories
// @route   GET /api/facilities/categories/list
exports.getFacilityCategories = async (req, res) => {
  try {
    const categories = await Facility.distinct('category', { isActive: true });
    
    // Add friendly names for categories
    const categoryMap = {
      'academic': 'Academic Facilities',
      'sports': 'Sports & Recreation',
      'infrastructure': 'Infrastructure',
      'technology': 'Technology',
      'recreation': 'Recreation',
      'other': 'Other Facilities'
    };

    const categoriesWithNames = categories.map(cat => ({
      value: cat,
      label: categoryMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    }));

    res.json({
      success: true,
      data: categoriesWithNames
    });
  } catch (error) {
    console.error('Get facility categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get facility statistics
// @route   GET /api/facilities/stats
exports.getFacilityStats = async (req, res) => {
  try {
    const totalFacilities = await Facility.countDocuments();
    const activeFacilities = await Facility.countDocuments({ isActive: true });
    const homepageFacilities = await Facility.countDocuments({ 
      isActive: true, 
      displayOnHomepage: true 
    });
    
    const categoryStats = await Facility.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const availabilityStats = await Facility.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$availability', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalFacilities,
        activeFacilities,
        homepageFacilities,
        categoryStats,
        availabilityStats
      }
    });
  } catch (error) {
    console.error('Get facility statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};