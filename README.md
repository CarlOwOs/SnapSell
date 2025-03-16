# Marketplace App with Real-time Notifications

This marketplace application includes a real-time notification system that can receive messages from third-party services and display them in a notifications screen.

## Features

- Real-time notifications using Socket.IO
- Webhook endpoint for third-party services to send notifications
- Notification history and read status tracking
- Alert notifications when the app is open

## Setup and Installation

1. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd my-marketplace-backend
npm install
```

2. Create a `.env` file in the `my-marketplace-backend` directory with the following variables:

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
PORT=5001
```

3. Start the backend server:

```bash
cd my-marketplace-backend
npm run dev
```

4. Start the frontend application:

```bash
npm start
```

## Third-Party Integration

Third-party services can send notifications to the application by making a POST request to the webhook endpoint:

```
POST http://your-server-url/webhook/notifications
```

Request body:

```json
{
  "title": "Notification Title",
  "message": "Notification message content",
  "type": "info", // Optional: info, success, warning, error
  "sender": "Service Name" // Optional: defaults to "system"
}
```

## Testing Notifications

You can test the notification system using the provided test script:

```bash
cd my-marketplace-backend
npm run test-notification
```

This script will send an initial test notification and then continue to send random notifications every 10 seconds for 2 minutes.

## API Endpoints

### Notifications

- `GET /notifications` - Get all notifications
- `POST /webhook/notifications` - Receive notifications from third-party services
- `PUT /notifications/:id/read` - Mark a notification as read
- `DELETE /notifications` - Clear all notifications (for testing purposes)

## Socket.IO Events

The application uses the following Socket.IO events:

- `notifications` - Sent when a client connects, contains all notifications
- `new_notification` - Sent when a new notification is received
- `notification_read` - Sent when a notification is marked as read 