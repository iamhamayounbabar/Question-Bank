import { notification } from 'antd';
export class NotificationService {
    types = {
        error: 'error',
        success: 'success',
        warning: 'warning',
        info: 'info'
    }

    sendNotification = (type, message, description, duration = 3) => {
        notification.open({
            type: type,
            message: message,
            description: description,
            duration: duration
        })
    }
}