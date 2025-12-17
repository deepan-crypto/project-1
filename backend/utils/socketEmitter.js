/**
 * Socket.IO utility for emitting real-time events
 */

/**
 * Emit a new notification to a specific user
 * @param {string} userId - The recipient user's ID
 * @param {Object} notification - The notification object
 */
const emitNotification = (userId, notification) => {
    if (global.io && userId) {
        global.io.to(userId.toString()).emit('new_notification', notification);
        console.log(`Emitted notification to user ${userId}`);
    }
};

/**
 * Emit notification update (e.g., follow request accepted/rejected)
 * @param {string} userId - The user's ID
 * @param {Object} data - The update data
 */
const emitNotificationUpdate = (userId, data) => {
    if (global.io && userId) {
        global.io.to(userId.toString()).emit('notification_update', data);
    }
};

/**
 * Emit follow status change
 * @param {string} userId - The user's ID
 * @param {Object} data - Follow status data
 */
const emitFollowUpdate = (userId, data) => {
    if (global.io && userId) {
        global.io.to(userId.toString()).emit('follow_update', data);
    }
};

module.exports = {
    emitNotification,
    emitNotificationUpdate,
    emitFollowUpdate,
};
