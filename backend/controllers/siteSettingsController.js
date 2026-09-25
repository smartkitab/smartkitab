import SiteSettings from '../models/SiteSettings.js';

// GET /api/site-settings (Public)
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve site settings',
      error: error.message,
    });
  }
};

// PUT /api/admin/site-settings (Admin Protected)
export const updateSiteSettings = async (req, res) => {
  try {
    const { announcement, hero, metrics, bookCycle, contact, commerce } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({});
    }

    if (announcement) settings.announcement = { ...settings.announcement.toObject(), ...announcement };
    if (hero) settings.hero = { ...settings.hero.toObject(), ...hero };
    if (metrics && Array.isArray(metrics)) settings.metrics = metrics;
    if (bookCycle) settings.bookCycle = { ...settings.bookCycle.toObject(), ...bookCycle };
    if (contact) settings.contact = { ...settings.contact.toObject(), ...contact };
    if (commerce) settings.commerce = { ...settings.commerce.toObject(), ...commerce };

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error.message,
    });
  }
};

// POST /api/admin/site-settings/reset (Admin Protected)
export const resetSiteSettings = async (req, res) => {
  try {
    await SiteSettings.deleteMany({});
    const defaultSettings = await SiteSettings.create({});

    return res.status(200).json({
      success: true,
      message: 'Site settings have been reset to default values',
      settings: defaultSettings,
    });
  } catch (error) {
    console.error('Error resetting site settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset site settings',
      error: error.message,
    });
  }
};

