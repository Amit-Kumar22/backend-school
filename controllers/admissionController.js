const Admission = require('../models/Admission');

// @desc    Get all admissions
// @route   GET /api/admissions
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort('-createdAt');
    
    res.json({
      success: true,
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    console.error('Get all admissions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single admission
// @route   GET /api/admissions/:id
exports.getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission not found' 
      });
    }

    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('Get admission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create admission
// @route   POST /api/admissions
exports.createAdmission = async (req, res) => {
  try {
    const { title, description, steps, requirements } = req.body;

    const admission = await Admission.create({
      title,
      description,
      steps,
      requirements
    });

    res.status(201).json({
      success: true,
      message: 'Admission created successfully',
      data: admission
    });
  } catch (error) {
    console.error('Create admission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update admission info
// @route   PUT /api/admissions/:id
exports.updateAdmission = async (req, res) => {
  try {
    const { title, description, steps, requirements } = req.body;

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        steps,
        requirements,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission info not found' 
      });
    }

    res.json({
      success: true,
      message: 'Admission info updated successfully',
      data: admission
    });
  } catch (error) {
    console.error('Update admission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete admission
// @route   DELETE /api/admissions/:id
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission not found' 
      });
    }

    res.json({
      success: true,
      message: 'Admission deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete admission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
