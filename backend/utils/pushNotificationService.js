const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a user
 * @param {string} userId - The recipient user's ID
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Additional data to send with notification
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
    try {
        // Get user's push tokens
        const user = await User.findById(userId).select('pushTokens');

        if (!user || !user.pushTokens || user.pushTokens.length === 0) {
            console.log(`No push tokens found for user ${userId}`);
            return;
        }

        // Create messages array
        const messages = [];

        for (const pushToken of user.pushTokens) {
            // Check if token is valid Expo push token
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct the message
            messages.push({
                to: pushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data,
                priority: 'high',
                channelId: 'default',
            });
        }

        // Send notifications in chunks
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
            }
        }

        // Handle tickets to remove invalid tokens
        const invalidTokens = [];

        // Map each ticket back to its corresponding token
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const pushToken = messages[i]?.to; // Get the token from the message

            if (ticket.status === 'error') {
                console.error(`Error sending to ${pushToken}:`, ticket.message);

                // If token is invalid, mark it for removal
                if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
                    if (pushToken) {
                        invalidTokens.push(pushToken);
                    }
                }
            }
        }

        // Remove invalid tokens from user
        if (invalidTokens.length > 0) {
            await User.findByIdAndUpdate(userId, {
                $pull: { pushTokens: { $in: invalidTokens } }
            });
            console.log(`Removed ${invalidTokens.length} invalid tokens for user ${userId}`);
        }

        console.log(`Successfully sent ${messages.length} push notifications to user ${userId}`);
        return tickets;

    } catch (error) {
        console.error('Error in sendPushNotification:', error);
        throw error;
    }
};

module.exports = {
    sendPushNotification,
};
