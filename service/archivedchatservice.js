const mongoose = require('mongoose');
const Chat = require('../models/archivedchat.js');

let archivedChatService = {
    async shareSongUrl(senderId, receiverId, trackUrl) {
        try {
            // Validate ObjectIds || Deepseek
            if (!mongoose.Types.ObjectId.isValid(senderId) ||
                !mongoose.Types.ObjectId.isValid(receiverId)) {
                throw new Error('Invalid user ID format');
            }else if(senderId.toString() === receiverId.toString()){
                throw new Error('Sender and receiver cannot be the same');
            }

            // Create sorted
            const participants = [senderId, receiverId].sort((a, b) =>
                a.toString().localeCompare(b.toString())
            );

            // Check for existing chat
            let chat = await Chat.findOne({
                participants: { $all: participants }
            });

            // Create new message object
            const newMessage = {
                from: senderId,
                to: receiverId,
                songurl: trackUrl
            };

            if (chat) {
                chat.Messages.push(newMessage);
                await chat.save();
                return {
                    success: true,
                    message: "Message added to existing chat",
                    chatId: chat._id
                };
            } else {
                chat = await Chat.create({
                    participants: participants,
                    Messages: [newMessage]
                });
                return {
                    success: true,
                    message: "New chat created with message",
                    chatId: chat._id
                };
            }
        } catch (error) {
            console.error('Error in shareSongUrl:', error);
            throw error;
        }
    },

    async getChatBetweenUsers(user1Id, user2Id) {
        try {
            const participants = [user1Id, user2Id].sort((a, b) =>
                a.toString().localeCompare(b.toString())
            );

            const chat = await Chat.findOne({
                participants: { $all: participants }
            })
                .populate('participants', 'username email')
                .populate('Messages.from Messages.to', 'username');

            return chat;
        } catch (error) {
            console.error('Error in getChatBetweenUsers:', error);
            throw error;
        }
    },

    async getUserChats(userId) {
        try {
            const chats = await Chat.find({
                participants: userId
            })
                .populate('participants', 'username email')
                .sort({ updatedAt: -1 });

            return chats;
        } catch (error) {
            console.error('Error in getUserChats:', error);
            throw error;
        }
    },

    async getChatMessages(chatId, limit = 50) {
        try {
            const chat = await Chat.findById(chatId)
                .populate('Messages.from Messages.to', 'username')
                .select('Messages');

            if (!chat) return null;

            return chat.Messages.slice(-limit);
        } catch (error) {
            console.error('Error in getChatMessages:', error);
            throw error;
        }
    }
};

module.exports = archivedChatService;