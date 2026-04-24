const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
exports.getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    
    // Build query
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Execute query with pagination
    const notices = await Notice.find(query)
      .sort({ date: -1, createdAt: -1 }) // Latest first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Notice.countDocuments(query);

    res.json({
      success: true,
      data: notices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices'
    });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice'
    });
  }
};

// @desc    Create new notice
// @route   POST /api/notices
exports.createNotice = async (req, res) => {
  try {
    const { title, description, imageUrl, date, isActive = true } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Prepare notice data
    const noticeData = {
      title: title.trim(),
      description: description?.trim() || '',
      isActive
    };

    // Handle date
    if (date) {
      noticeData.date = new Date(date);
    }

    // Handle image URL
    if (imageUrl && imageUrl.trim()) {
      noticeData.imageUrl = imageUrl.trim();
    }

    // Create notice
    const notice = await Notice.create(noticeData);

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice
    });
  } catch (error) {
    console.error('Create notice error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create notice'
    });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
exports.updateNotice = async (req, res) => {
  try {
    const { title, description, imageUrl, date, isActive } = req.body;

    // Find existing notice
    const existingNotice = await Notice.findById(req.params.id);
    if (!existingNotice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (date) updateData.date = new Date(date);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image URL
    if (imageUrl !== undefined) {
      if (imageUrl && imageUrl.trim()) {
        updateData.imageUrl = imageUrl.trim();
      } else {
        updateData.imageUrl = '';
      }
    }

    // Update notice
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (error) {
    console.error('Update notice error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update notice'
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Delete notice
    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice'
    });
  }
};