import React from 'react';

interface Notification {
  icon?: string;
  title?: string;
  body?: string;
}

interface MessageProps {
  notification: Notification;
}

const Message: React.FC<MessageProps> = ({ notification }) => {
  return (
    <>
      <div id="notificationHeader">
          <div id="imageContainer">
            <img src={notification.icon ?? "https://dgya0msbvt7mc.cloudfront.net/logo32.png"} width={32} />
          </div>
        <span>{notification.title}</span>
      </div>
      <div id="notificationBody">{notification.body}</div>
    </>
  );
};

export default Message;
