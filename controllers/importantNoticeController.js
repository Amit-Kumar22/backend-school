const ImportantNotice = require('../models/ImportantNotice');

// @desc    Get all important notices
// @route   GET /api/important-notices
exports.getAllImportantNotices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      priority, 
      type, 
      isActive, 
      displayOnHomepage 
    } = req.query;

    const filter = {};
    
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (displayOnHomepage !== undefined) filter.displayOnHomepage = displayOnHomepage === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notices = await ImportantNotice.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await ImportantNotice.countDocuments(filter);
    
    res.json({
      success: true,
      count: notices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: notices
    });
  } catch (error) {
    console.error('Get all important notices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get active important notices for homepage
// @route   GET /api/important-notices/active
exports.getActiveImportantNotices = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const notices = await ImportantNotice.getActiveForHomepage()
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    console.error('Get active important notices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single important notice
// @route   GET /api/important-notices/:id
exports.getImportantNotice = async (req, res) => {
  try {
    const notice = await ImportantNotice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Important notice not found' 
      });
    }

    // Increment view count
    notice.viewCount += 1;
    await notice.save();

    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    console.error('Get important notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create important notice
// @route   POST /api/important-notices
exports.createImportantNotice = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      link, 
      linkText,
      priority, 
      type, 
      startDate, 
      endDate,
      isActive, 
      displayOnHomepage,
      showAsTicker,
      createdBy 
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const notice = await ImportantNotice.create({
      title,
      description,
      link: link || '',
      linkText: linkText || 'Read More',
      priority: priority || 'medium',
      type: type || 'info',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      displayOnHomepage: displayOnHomepage !== undefined ? displayOnHomepage : true,
      showAsTicker: showAsTicker !== undefined ? showAsTicker : false,
      createdBy: createdBy || 'Admin'
    });

    res.status(201).json({
      success: true,
      message: 'Important notice created successfully',
      data: notice
    });
  } catch (error) {
    console.error('Create important notice error:', error);
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

// @desc    Update important notice
// @route   PUT /api/important-notices/:id
exports.updateImportantNotice = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      link, 
      linkText,
      priority, 
      type, 
      startDate, 
      endDate,
      isActive, 
      displayOnHomepage,
      showAsTicker 
    } = req.body;

    const notice = await ImportantNotice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        link,
        linkText,
        priority,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isActive,
        displayOnHomepage,
        showAsTicker,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Important notice not found' 
      });
    }

    res.json({
      success: true,
      message: 'Important notice updated successfully',
      data: notice
    });
  } catch (error) {
    console.error('Update important notice error:', error);
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

// @desc    Delete important notice
// @route   DELETE /api/important-notices/:id
exports.deleteImportantNotice = async (req, res) => {
  try {
    const notice = await ImportantNotice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Important notice not found' 
      });
    }

    await ImportantNotice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Important notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete important notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/important-notices/:id/toggle-active
exports.toggleActiveStatus = async (req, res) => {
  try {
    const notice = await ImportantNotice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Important notice not found' 
      });
    }

    notice.isActive = !notice.isActive;
    notice.updatedAt = Date.now();
    await notice.save();

    res.json({
      success: true,
      message: `Important notice ${notice.isActive ? 'activated' : 'deactivated'} successfully`,
      data: notice
    });
  } catch (error) {
    console.error('Toggle active status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get notice statistics
// @route   GET /api/important-notices/stats
exports.getNoticeStats = async (req, res) => {
  try {
    const totalNotices = await ImportantNotice.countDocuments();
    const activeNotices = await ImportantNotice.countDocuments({ isActive: true });
    const homepageNotices = await ImportantNotice.countDocuments({ 
      isActive: true, 
      displayOnHomepage: true 
    });
    
    const priorityStats = await ImportantNotice.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const typeStats = await ImportantNotice.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalNotices,
        activeNotices,
        homepageNotices,
        priorityStats,
        typeStats
      }
    });
  } catch (error) {
    console.error('Get notice statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};