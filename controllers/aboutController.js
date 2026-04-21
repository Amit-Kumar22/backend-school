const About = require('../models/About');

// @desc    Get all about sections
// @route   GET /api/about
exports.getAllAbout = async (req, res) => {
  try {
    const abouts = await About.find().sort('-createdAt');
    
    res.json({
      success: true,
      count: abouts.length,
      data: abouts
    });
  } catch (error) {
    console.error('Get all about error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single about section
// @route   GET /api/about/:id
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    
    if (!about) {
      return res.status(404).json({ 
        success: false, 
        message: 'About section not found' 
      });
    }

    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create about section
// @route   POST /api/about
exports.createAbout = async (req, res) => {
  try {
    const { title, description, mission, vision, image, stats } = req.body;

    const about = await About.create({
      title,
      description,
      mission,
      vision,
      image,
      stats
    });

    res.status(201).json({
      success: true,
      message: 'About section created successfully',
      data: about
    });
  } catch (error) {
    console.error('Create about error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update about section
// @route   PUT /api/about/:id
exports.updateAbout = async (req, res) => {
  try {
    const { title, description, mission, vision, image, stats } = req.body;

    const about = await About.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        mission,
        vision,
        image,
        stats,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!about) {
      return res.status(404).json({ 
        success: false, 
        message: 'About section not found' 
      });
    }

    res.json({
      success: true,
      message: 'About section updated successfully',
      data: about
    });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete about section
// @route   DELETE /api/about/:id
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);

    if (!about) {
      return res.status(404).json({ 
        success: false, 
        message: 'About section not found' 
      });
    }

    res.json({
      success: true,
      message: 'About section deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete about error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
