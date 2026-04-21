const Hero = require('../models/Hero');

// @desc    Get all hero sections
// @route   GET /api/hero
exports.getAllHero = async (req, res) => {
  try {
    const heroes = await Hero.find().sort('-createdAt');
    
    res.json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    console.error('Get all hero error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single hero section
// @route   GET /api/hero/:id
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hero section not found' 
      });
    }

    res.json({
      success: true,
      data: hero
    });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create hero section
// @route   POST /api/hero
exports.createHero = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, backgroundImage, isActive } = req.body;

    // If this hero is set as active, deactivate all others
    if (isActive) {
      await Hero.updateMany({}, { isActive: false });
    }

    const hero = await Hero.create({
      title,
      subtitle,
      ctaText,
      ctaLink,
      backgroundImage,
      isActive: isActive || false
    });

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: hero
    });
  } catch (error) {
    console.error('Create hero error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update hero section
// @route   PUT /api/hero/:id
exports.updateHero = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, backgroundImage, isActive } = req.body;

    // If this hero is set as active, deactivate all others
    if (isActive) {
      await Hero.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        ctaText,
        ctaLink,
        backgroundImage,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!hero) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hero section not found' 
      });
    }

    res.json({
      success: true,
      message: 'Hero section updated successfully',
      data: hero
    });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete hero section
// @route   DELETE /api/hero/:id
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);

    if (!hero) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hero section not found' 
      });
    }

    res.json({
      success: true,
      message: 'Hero section deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete hero error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
