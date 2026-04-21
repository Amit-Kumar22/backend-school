const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contact
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Get all contacts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create contact
// @route   POST /api/contact
exports.createContact = async (req, res) => {
  try {
    const { 
      schoolName, 
      address, 
      phone, 
      email, 
      alternatePhone, 
      fax, 
      socialLinks,
      mapLocation 
    } = req.body;

    const contact = await Contact.create({
      schoolName,
      address,
      phone,
      email,
      alternatePhone,
      fax,
      socialLinks,
      mapLocation
    });

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact/:id
exports.updateContact = async (req, res) => {
  try {
    const { 
      schoolName, 
      address, 
      phone, 
      email, 
      alternatePhone, 
      fax, 
      socialLinks,
      mapLocation 
    } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        schoolName,
        address,
        phone,
        email,
        alternatePhone,
        fax,
        socialLinks,
        mapLocation,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact info not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact info updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
