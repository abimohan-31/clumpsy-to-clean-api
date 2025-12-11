import Customer from "../models/Customer.js";
import Provider from "../models/Provider.js";

// GET /api/customers/profile - Get customer profile
export const getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/customers/profile - Update customer profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, profileImage } = req.body;

    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    if (profileImage !== undefined) customer.profileImage = profileImage;

    await customer.save();

    const customerData = customer.toObject();
    delete customerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: {
        customer: customerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/customers/profile/image - Update profile image
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

    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    customer.profileImage = profileImage;
    await customer.save();

    const customerData = customer.toObject();
    delete customerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image updated successfully",
      data: {
        customer: customerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/profile/image - Delete profile image
export const deleteProfileImage = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    customer.profileImage = null;
    await customer.save();

    const customerData = customer.toObject();
    delete customerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image deleted successfully",
      data: {
        customer: customerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/providers - Get all approved providers (for customers to view)
export const getAllProviders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const { skill, availability_status } = req.query;

    // Build query
    const query = { isApproved: true };
    if (skill) {
      query.skills = { $in: [new RegExp(skill, "i")] };
    }
    if (availability_status) {
      query.availability_status = availability_status;
    }

    const providers = await Provider.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Provider.countDocuments(query);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        providers,
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

// GET /api/customers/providers/:id - Get provider by ID
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
        message: "Provider not found or not approved",
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

// GET /api/customers - Get all customers (admin only)
export const getAllCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };

    const customers = await Customer.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetch the customers successfully",
      data: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        customers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:id - Get customer by ID (admin only)
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetch a customer successfully",
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/:id - Delete customer (admin only)
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const banCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { account_status: "inactive" },
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Customer banned successfully",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

export const activateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { account_status: "active" },
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Customer activated successfully",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};
