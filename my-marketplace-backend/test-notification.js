const fetch = require('node-fetch');

// Function to send a test notification
async function sendTestNotification() {
  try {
    const response = await fetch('http://localhost:5001/webhook/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Notification',
        message: 'This is a test notification from a third-party service.',
        type: 'info',
        sender: 'Test Service'
      }),
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Send a notification immediately
sendTestNotification();

// Send additional notifications every 10 seconds
const interval = setInterval(() => {
  const types = ['info', 'success', 'warning', 'error'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  const senders = ['Payment Service', 'Shipping Service', 'Customer Support', 'System'];
  const randomSender = senders[Math.floor(Math.random() * senders.length)];
  
  const messages = [
    'Your item has been purchased!',
    'A buyer has a question about your listing.',
    'Your payment has been processed.',
    'Your shipping label is ready.',
    'A new offer has been made on your item.',
    'Your account has been verified.',
    'Reminder: You have pending actions.',
    'Security alert: New login detected.'
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  fetch('http://localhost:5001/webhook/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `${randomSender} Notification`,
      message: randomMessage,
      type: randomType,
      sender: randomSender
    }),
  })
    .then(response => response.json())
    .then(data => console.log('Sent notification:', data))
    .catch(error => console.error('Error sending notification:', error));
}, 10000);

// Stop after 2 minutes (optional)
setTimeout(() => {
  clearInterval(interval);
  console.log('Test completed');
  process.exit(0);
}, 120000);

console.log('Test script running. Press Ctrl+C to stop.'); 