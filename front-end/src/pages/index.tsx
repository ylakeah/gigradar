import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  Input,
  Button,
  List,
  Typography,
  Upload,
  Spin,
  Avatar,
  Space,
} from 'antd';
import {
  UploadOutlined,
  RollbackOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

import * as Bytescale from '@bytescale/sdk';
import 'dotenv/config'

const { TextArea } = Input;
const { Title } = Typography;

const apiKey = process.env.REACT_APP_API_KEY;
console.log(apiKey);

console.log(process.env.REACT_APP_API_URL);
console.log(process.env.REACT_APP_SOCKET_URL);
const uploadManager = new Bytescale.UploadManager({
  'apiKey': process.env.REACT_APP_BYTESCALE_KEY!,
});

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState<any>({});
  const [initialLoad, setInitialLoad] = useState(true);

   useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
      return;
    }

    const newSocket = io('ws://localhost:3005', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      newSocket.emit('getMessages', offset);
    });

    newSocket.on('message', (msg: any) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    newSocket.on('messages', (msgs: any) => {
      if (initialLoad) {
        setMessages(msgs);
        setInitialLoad(false);
        scrollToBottom();
      } else {
        const previousHeight = messageListRef.current?.scrollHeight;
        setMessages((prevMessages) => [...msgs, ...prevMessages]);
        setLoadingMore(false);
        if (previousHeight) {
          setTimeout(() => {
            if (messageListRef.current) {
              messageListRef.current.scrollTop = messageListRef.current.scrollHeight - previousHeight + 20; // Scroll down 20px after loading old messages
            }
          }, 0);
        }
      }
      if (msgs.length < 25) {
        setHasMore(false);
      }
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [offset]);

  useEffect(() => {
    if (messageListRef.current && initialLoad === false) {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = () => {
    if (
      messageListRef.current &&
      messageListRef.current.scrollTop === 0 &&
      !loadingMore &&
      hasMore
    ) {
      setLoadingMore(true);
      setOffset((prevOffset) => prevOffset + 25);
    }
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    setUploading(true);
    let uploadedImageURL = '';

    if (imageFile) {
      try {
        const { fileUrl } = await uploadManager.upload({ data: imageFile });
        uploadedImageURL = fileUrl;
      } catch (e: any) {
        alert(`Error:\n${e.message}`);
      }
    }

    if (message.trim() || uploadedImageURL) {
      const content = message.trim();
      socket.emit('message', {
        content,
        replyTo,
        image: uploadedImageURL,
      });
      setMessage('');
      setImageFile(null);
      setImageURL('');
      setReplyTo(null);
    }

    setUploading(false);
  };

  const handleFileChange = (info: any) => {
    const file = info.file;
    const reader = new FileReader();

    reader.onload = () => {
      setImageFile(file);
      setImageURL(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleReply = (messageId: string) => {
    setReplyTo(messageId);
    setReplyMsg(messages.find((msg) => msg._id === messageId));
  };

  
  const renderMessages = (
    msgs: any[],
    parentId: string | null = null,
    level: number = 0
  ) => {
    return msgs
      .filter((msg) => msg.replyTo === parentId)
      .map((msg) => (
        <div key={msg._id} style={{ marginLeft: `${level * 20}px` }}>
          <List.Item
            onClick={() => handleReply(msg._id)}
            style={{ borderRadius: '4px', cursor: 'pointer', marginBottom: '8px', transition: 'background 0.3s' }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${msg.user.username}`}
                />
              }
              title={`${msg.user.username} (${new Date(
                msg.timestamp
              ).toLocaleTimeString()})`}
              description={
                <div>
                  <p>{msg.content}</p>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attached"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  )}
                </div>
              }
            />
            <div>
              <RollbackOutlined /> reply
            </div>
          </List.Item>
          {renderMessages(msgs, msg._id, level + 1)}
        </div>
      ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Chat Room</Title>
      <div
        ref={messageListRef}
        style={{
          marginBottom: '20px',
          maxHeight: '400px',
          overflowY: 'scroll',
          border: '1px solid #f0f0f0',
          borderRadius: '4px',
          padding: '10px',
        }}
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <Spin />
          </div>
        )}
        <List bordered>{renderMessages(messages)}</List>
      </div>
      {replyTo && (
        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          Replying to: {`${replyMsg.user.username} (${new Date(replyMsg.timestamp).toLocaleTimeString()})`}
        </div>
      )}
      <TextArea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ borderRadius: '4px' }}
      />
      <br /><br />
      <Space size="middle">
        {imageURL ? (
          <Button icon={<CloseOutlined />} onClick={() => setImageURL('')}>
            Cancel
          </Button>
        ) : (
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Attach File</Button>
          </Upload>
        )}
        <Button
          type="primary"
          onClick={sendMessage}
          disabled={uploading || (!message.trim() && !imageURL)}
          style={{ transition: 'background 0.3s', border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
        >
          {uploading ? <Spin /> : 'Send'}
        </Button>
      </Space>
      {imageURL && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={imageURL}
            alt="preview"
            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
