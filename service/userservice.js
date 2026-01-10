const mongoose = require('mongoose');
const user = require('../models/user.js');
const e = require('express');

let userservice = {

    async createUser(email, password, username) {
        try {
            // Check if a user with the same email already exists
            const existingUser = await user.findOne({
                email: email
            });
            if (existingUser) {
                throw new Error('A user with this email already exists.');
            }

            const newUser = await user.create({
                email: email,
                password: password,
                username: username
            });

            return newUser;
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to create user: ${e.message}`);
        }
    },


    async getUserById(userId) {
        try {
            const foundUser = await user.findById(userId);
            if (!foundUser) {
                throw new Error('User not found.');
            }
            return foundUser;
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to retrieve user with ID: ${userId}.`);
        }
    },


    async updateUser(userId, updateData) {
        try {
            const updatedUser = await user.findByIdAndUpdate(
                userId,
                updateData, {
                new: true // This option returns the document after the update
            }
            );

            if (!updatedUser) {
                throw new Error('User not found for update.');
            }

            return updatedUser;
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to update user with ID: ${userId}.`);
        }
    },


    async deleteUser(userId) {
        try {
            const deletedUser = await user.findByIdAndDelete(userId);

            if (!deletedUser) {
                throw new Error('User not found for deletion.');
            }

            return {
                message: 'User deleted successfully.',
                deletedUserId: userId
            };
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to delete user with ID: ${userId}.`);
        }
    },


    async userlogin(email, password) {
        try {
            let result = await user.findOne({
                email: email,
                password: password
            });
            return result;
        } catch (e) {
            console.error(e.message);
            throw new Error("Error logging in, please try again later.");
        }
    },

    async updateToken(userId, token) {
        try {
            await user.findByIdAndUpdate(userId, {
                token: token
            });
            return;
        } catch (e) {
            console.error(e.message);
            throw new Error("Error updating user token, please try again later.");
        }
    },


    async checkToken(token) {
        try {
            let result = await user.findOne({
                token: token
            });
            return result;
        } catch (e) {
            console.error(e.message);
            throw new Error("Error checking token, please try again later.");
        }
    },


    async removeToken(userId) {
        try {
            const result = await user.findByIdAndUpdate(userId, {
                $unset: {
                    token: 1
                }
            });
            if (!result) {
                throw new Error("User not found to remove token.");
            }
            return;
        } catch (e) {
            console.error(e.message);
            throw new Error("Error removing token, please try again later.");
        }
    },

    async UpdateUser(userId, updateData) {
        try {
            let result = await user.findOneAndUpdate(userId, updateData);
            if (!result) return "Unable to update user";
            else return "User updated successfully";
        } catch (e) {
            console.error(e.message);
            throw new Error("Error updating user, please try again later.");
        }
    },

    async addFriend(userId, friendId) {
        try {
            if (userId == friendId) {
                throw new Error("You cannot add yourself as a friend");
            }
            let findId = await user.findById(friendId);
            if (!findId) {
                throw new Error("User not found");
            }
            let sentRequest = await user.findOne({
                _id: userId,
                "friends.user": friendId,
                "friends.status": "pending"
            })
            let existingFriend = await user.findOne({
                _id: userId,
                "friends.user": friendId,
                "friends.status": "accepted"
            });
            if (existingFriend || sentRequest) {
                throw new Error("User is already your friend or has a pending request");
            } else {

                let result = await user.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            friends: {
                                user: friendId,
                                status: 'pending'
                            }
                        }
                    },
                    { new: true }
                );
                let sendRequest = await user.findByIdAndUpdate(
                    friendId,
                    {
                        $push: {
                            requests: {
                                user: userId
                            }
                        }
                    }
                )

                if (!result) {
                    throw new Error("Unable to add friend");
                }
                if (!sendRequest) {
                    throw new Error("Unable to send friend request");
                }

                return "Friend request sent successfully";

            }
        } catch (e) {
            console.error(e.message);
            throw new Error("Error adding friend, please try again later.");
        }
    },
    async acceptFriend(userId, friendId) {
        try {
            // Check if the request exists for the current user
            let findIncomingRequest = await user.findOne({
                _id: userId,
                "requests.user": friendId
            });

            if (!findIncomingRequest) {
                throw new Error("Friend request not found");
            }

            // Update the sender's friend list status to accepted
            await user.updateOne(
                {
                    _id: friendId,
                    "friends.user": userId
                },
                {
                    $set:
                    {
                        "friends.$.status": "accepted"
                    }
                }
            );

            // Remove from requests and add to friends
            let updateReceiver = await user.findByIdAndUpdate(
                userId,
                {
                    $pull:
                    {
                        requests:
                        {
                            user: friendId
                        }
                    },
                    $push:
                    {
                        friends:
                        {
                            user: friendId, status: "accepted"
                        }
                    }
                },
                { new: true }
            );

            if (!updateReceiver) {
                throw new Error("Unable to accept friend request");
            }

            return "Friend request accepted successfully";
        } catch (e) {
            console.error(e.message);
            throw new Error("Error accepting friend: " + e.message);
        }

    },
    async rejectFriend(userId, friendId) {
        try {
            // Check if the request exists for the current user
            let findIncomingRequest = await user.findOne({
                _id: userId,
                "requests.user": friendId
            });

            if (!findIncomingRequest) {
                throw new Error("Friend request not found");
            }
            // Remove and delete friendId's request
            let updateReciever = await user.findByIdAndUpdate(
                userId,
                {
                    $pull:
                    {
                        requests:
                        {
                            user: friendId
                        }
                    }
                }
            )
            // Remove and delete userId's friend
            let updateSender = await user.findByIdAndUpdate(
                friendId,
                {
                    $pull:
                    {
                        friends:
                        {
                            user: userId
                        }
                    }
                }
            )

            if (!updateSender) {
                console.error(e.message);
                throw new Error("Unable to reject friend request");
            }

            if (!updateReciever) {
                console.error(e.message);
                throw new Error("Unable to reject friend request");
            }

            return "Friend request rejected successfully";
        } catch (e) {
            console.error(e.message);
            throw new Error("Error rejecting friend request: " + e.message);
        }
    },
    async removeFriend(userId, friendId) {
        try {
            let validateFriend = await user.findOne({
                _id: userId,
                "friends.user": friendId
            });
            if (!validateFriend) {
                throw new Error("Friend not found");
            }
            // Remove friend from list vice versa
            let updateFriend = await user.findByIdAndUpdate(
                friendId, {
                $pull: {
                    friends: {
                        user: userId
                    }
                }
            }
            )
            let updateSender = await user.findByIdAndUpdate(
                userId, {
                $pull: {
                    friends: {
                        user: friendId
                    }
                }
            }
            )
            if (!updateFriend) {
                throw new Error("Unable to remove friend");
            }
            if (!updateSender) {
                throw new Error("Unable to remove friend");
            }

            return "Removed friend successfully";
        } catch (e) {
            console.error(e.message);
            throw new Error("Error removing friend: " + e.message);
        }
    }
};



module.exports = userservice;