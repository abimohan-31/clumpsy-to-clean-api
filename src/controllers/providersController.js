import Provider from "../models/Provider.js";
import Subscription from "../models/Subscription.js";
import Review from "../models/Review.js";

// GET /api/providers/check-approval/:id - Check approval status by provider ID (public route)
// Allows providers to check their approval status without authentication
export const checkApprovalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Provider ID is required",
        errors: [{ field: "id", message: "Provider ID is required" }],
      });
    }

    const provider = await Provider.findById(id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    // Determine status message
    let statusMessage = "";
    if (provider.isApproved) {
      statusMessage = "Your account is approved. You can now log in and access all provider features.";
    } else {
      statusMessage = "Your account is pending approval. Please wait for admin approval before you can log in.";
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        isApproved: provider.isApproved,
        status: provider.isApproved ? "Approved" : "Pending",
        message: statusMessage,
        provider: {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          isApproved: provider.isApproved,
          createdAt: provider.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/profile - Get provider profile
export const getProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        provider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/profile - Update provider profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      experience_years,
      skills,
      availability_status,
      profileImage,
    } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (address) provider.address = address;
    if (experience_years) provider.experience_years = experience_years;
    if (skills) provider.skills = skills;
    if (availability_status) provider.availability_status = availability_status;
    if (profileImage !== undefined) provider.profileImage = profileImage;

    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/subscription - Get provider subscription
export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      provider_id: req.user.id,
    })
      .populate("provider_id", "name email")
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No subscription found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/reviews - Get provider reviews
export const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: q } },
        { email: { $regex: q } },
        { phone: { $regex: q } },
      ],
    };

    const reviews = await Review.find({ provider_id: req.user.id }, filter)
      .populate("customer_id", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ review_date: -1 });

    const total = await Review.countDocuments({ provider_id: req.user.id });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public - Get all approved providers (public route)
export const getAllProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isApproved: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };
    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        providers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public/:id - Get provider by ID (public route)
export const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findOne({
      _id: id,
      isApproved: true,
    }).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        provider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/admin/all - Get all providers for admin (including pending)
export const getAllProvidersForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };
    
    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: providers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/:id/approve - Approve a provider (admin only)
export const approveProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.isApproved = true;
    await provider.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider approved successfully",
      data: {
        provider: {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          isApproved: provider.isApproved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/:id - Delete/reject a provider (admin only)
export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByIdAndDelete(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/:id/reject - Reject a provider (admin only)
export const rejectProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.isApproved = false;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: reason
        ? `Provider rejected. Reason: ${reason}`
        : "Provider rejected successfully",
      data: {
        provider: providerData,
        rejectionReason: reason || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/providers/profile/image - Update profile image
export const updateProfileImage = async (req, res, next) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Profile image URL is required",
      });
    }

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.profileImage = profileImage;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image updated successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/profile/image - Delete profile image
export const deleteProfileImage = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.profileImage = null;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image deleted successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/providers/work-images - Create work image
export const createWorkImage = async (req, res, next) => {
  try {
    const { title, description, beforeImage, afterImage, category } = req.body;

    if (!title || !beforeImage || !afterImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Title, before image, and after image are required",
      });
    }

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = {
      title,
      description: description || "",
      beforeImage,
      afterImage,
      category: category || "",
      createdAt: new Date(),
    };

    provider.workImages.push(workImage);
    await provider.save();

    const addedImage = provider.workImages[provider.workImages.length - 1];

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Work image created successfully",
      data: {
        workImage: addedImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/work-images - Get all work images for logged-in provider
export const getAllWorkImages = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id).select("workImages");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workImages: provider.workImages || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/work-images/:id - Get single work image
export const getWorkImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/work-images/:id - Update work image
export const updateWorkImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, beforeImage, afterImage, category } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    if (title) workImage.title = title;
    if (description !== undefined) workImage.description = description;
    if (beforeImage) workImage.beforeImage = beforeImage;
    if (afterImage) workImage.afterImage = afterImage;
    if (category !== undefined) workImage.category = category;

    await provider.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work image updated successfully",
      data: {
        workImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/work-images/:id - Delete work image
export const deleteWorkImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    workImage.deleteOne();
    await provider.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public/:providerId/work-images - Get work images for public viewing
export const getPublicWorkImages = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findOne({
      _id: providerId,
      isApproved: true,
    }).select("workImages name");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found or not approved",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        providerName: provider.name,
        workImages: provider.workImages || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/pending - Get pending providers
export const getPendingProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isApproved: false,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };

    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        providers,
      },
    });
  } catch (error) {
    next(error);
  }
};
