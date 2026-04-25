const SchoolTiming = require('../models/SchoolTiming');

// @desc    Get all school timings
// @route   GET /api/school-timing
exports.getAllSchoolTimings = async (req, res) => {
  try {
    const timings = await SchoolTiming.find().sort('-createdAt');
    
    res.json({
      success: true,
      count: timings.length,
      data: timings
    });
  } catch (error) {
    console.error('Get all school timings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get active school timing for display
// @route   GET /api/school-timing/active
exports.getActiveSchoolTiming = async (req, res) => {
  try {
    const timing = await SchoolTiming.findOne({ 
      isActive: true, 
      displayOnHomepage: true 
    }).sort('-createdAt');
    
    if (!timing) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active school timing found' 
      });
    }

    res.json({
      success: true,
      data: timing
    });
  } catch (error) {
    console.error('Get active school timing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single school timing
// @route   GET /api/school-timing/:id
exports.getSchoolTiming = async (req, res) => {
  try {
    const timing = await SchoolTiming.findById(req.params.id);
    
    if (!timing) {
      return res.status(404).json({ 
        success: false, 
        message: 'School timing not found' 
      });
    }

    res.json({
      success: true,
      data: timing
    });
  } catch (error) {
    console.error('Get school timing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create school timing
// @route   POST /api/school-timing
exports.createSchoolTiming = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      timingEntries, 
      weekDays, 
      schoolStartTime, 
      schoolEndTime, 
      breakTime, 
      lunchTime, 
      isActive, 
      displayOnHomepage 
    } = req.body;

    // If this timing is set as active, deactivate all others
    if (isActive) {
      await SchoolTiming.updateMany({}, { isActive: false });
    }

    // If this timing is set to display on homepage, remove homepage display from others
    if (displayOnHomepage) {
      await SchoolTiming.updateMany({}, { displayOnHomepage: false });
    }

    const timing = await SchoolTiming.create({
      title,
      description,
      timingEntries: timingEntries || [],
      weekDays: weekDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      schoolStartTime,
      schoolEndTime,
      breakTime,
      lunchTime,
      isActive: isActive || false,
      displayOnHomepage: displayOnHomepage || false
    });

    res.status(201).json({
      success: true,
      message: 'School timing created successfully',
      data: timing
    });
  } catch (error) {
    console.error('Create school timing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update school timing
// @route   PUT /api/school-timing/:id
exports.updateSchoolTiming = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      timingEntries, 
      weekDays, 
      schoolStartTime, 
      schoolEndTime, 
      breakTime, 
      lunchTime, 
      isActive, 
      displayOnHomepage 
    } = req.body;

    // If this timing is set as active, deactivate all others
    if (isActive) {
      await SchoolTiming.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    // If this timing is set to display on homepage, remove homepage display from others
    if (displayOnHomepage) {
      await SchoolTiming.updateMany({ _id: { $ne: req.params.id } }, { displayOnHomepage: false });
    }

    const timing = await SchoolTiming.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        timingEntries,
        weekDays,
        schoolStartTime,
        schoolEndTime,
        breakTime,
        lunchTime,
        isActive,
        displayOnHomepage,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!timing) {
      return res.status(404).json({ 
        success: false, 
        message: 'School timing not found' 
      });
    }

    res.json({
      success: true,
      message: 'School timing updated successfully',
      data: timing
    });
  } catch (error) {
    console.error('Update school timing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete school timing
// @route   DELETE /api/school-timing/:id
exports.deleteSchoolTiming = async (req, res) => {
  try {
    const timing = await SchoolTiming.findById(req.params.id);
    
    if (!timing) {
      return res.status(404).json({ 
        success: false, 
        message: 'School timing not found' 
      });
    }

    await SchoolTiming.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'School timing deleted successfully'
    });
  } catch (error) {
    console.error('Delete school timing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/school-timing/:id/toggle-active
exports.toggleActiveStatus = async (req, res) => {
  try {
    const timing = await SchoolTiming.findById(req.params.id);
    
    if (!timing) {
      return res.status(404).json({ 
        success: false, 
        message: 'School timing not found' 
      });
    }

    // If setting to active, deactivate all others
    if (!timing.isActive) {
      await SchoolTiming.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    timing.isActive = !timing.isActive;
    timing.updatedAt = Date.now();
    await timing.save();

    res.json({
      success: true,
      message: `School timing ${timing.isActive ? 'activated' : 'deactivated'} successfully`,
      data: timing
    });
  } catch (error) {
    console.error('Toggle active status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};