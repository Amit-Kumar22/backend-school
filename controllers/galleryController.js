const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
exports.getAllGallery = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { isActive: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const gallery = await Gallery.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }

    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Get gallery by id error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create gallery item
// @route   POST /api/gallery
exports.createGallery = async (req, res) => {
  try {
    const { title, category, description, image } = req.body;

    const gallery = await Gallery.create({
      title,
      category,
      description,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
exports.updateGallery = async (req, res) => {
  try {
    const { title, category, description, image, isActive } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, category, description, image, isActive },
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get gallery categories
// @route   GET /api/gallery/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Gallery.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
