import User from './users.model.js';

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

export const getAllUsers = async () => {
    return await User.find();
};

export const getUserById = async (id) => {
    return await User.findById(id);
};

export const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const getUserByUsername = async (username) => {
    return await User.findOne({ username });
};

export const updateUser = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
