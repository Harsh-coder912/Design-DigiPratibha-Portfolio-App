import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  Send,
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  Check
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  department: string;
  lastActive: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'image';
}

interface Conversation {
  id: string;
  student: Student;
  lastMessage: Message | null;
  unreadCount: number;
  lastActivity: string;
}

interface MessageCenterProps {
  currentUserId: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-83d15fec`;

export default function MessageCenter({ currentUserId }: MessageCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: '1',
      student: {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@university.edu',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        department: 'Computer Science',
        lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isOnline: true
      },
      lastMessage: {
        id: '1',
        senderId: '1',
        receiverId: currentUserId,
        message: "Thank you for reviewing my portfolio! I'd love to discuss the internship opportunity.",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'read',
        type: 'text'
      },
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      student: {
        id: '2',
        name: 'Amit Patel',
        email: 'amit@university.edu',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
        department: 'Computer Science',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isOnline: false
      },
      lastMessage: {
        id: '2',
        senderId: currentUserId,
        receiverId: '2',
        message: "Hi Amit, I've reviewed your Java projects and they're impressive. Would you be interested in a technical interview?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        type: 'text'
      },
      unreadCount: 1,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      student: {
        id: '3',
        name: 'Emily Johnson',
        email: 'emily@university.edu',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        department: 'Data Science',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isOnline: false
      },
      lastMessage: {
        id: '3',
        senderId: '3',
        receiverId: currentUserId,
        message: "I've updated my portfolio with the machine learning project you suggested. Please take a look!",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        type: 'text'
      },
      unreadCount: 2,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: currentUserId,
      receiverId: '1',
      message: "Hi Sarah! I've reviewed your portfolio and I'm really impressed with your React projects.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      senderId: currentUserId,
      receiverId: '1',
      message: "Your UI/UX design skills particularly caught our attention. We have an internship position that might be perfect for you.",
      timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      receiverId: currentUserId,
      message: "Thank you so much! I'm really excited about this opportunity.",
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      senderId: '1',
      receiverId: currentUserId,
      message: "I'd love to learn more about the company culture and the projects I'd be working on.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      senderId: currentUserId,
      receiverId: '1',
      message: "Great! Let's schedule a video call this week. Are you available on Thursday afternoon?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: '6',
      senderId: '1',
      receiverId: currentUserId,
      message: "Thursday afternoon works perfectly for me! Thank you for considering my application.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ];

  useEffect(() => {
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedConversation.student.id,
      message: messageText,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };

    // Add message to UI
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // Simulate sending time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update message status to delivered (mock successful send)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
      
      // Simulate auto-reply from student after 2 seconds
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: selectedConversation.student.id,
          receiverId: currentUserId,
          message: `Thanks for your message! I'll get back to you soon.`,
          timestamp: new Date().toISOString(),
          status: 'sent',
          type: 'text'
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
      
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      
      // Remove the failed message from UI
      setMessages(prev => prev.filter(msg => msg.id !== message.id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-secondary' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.student.profileImage} />
                      <AvatarFallback>
                        {conversation.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.student.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.student.name}</h3>
                      <div className="flex items-center space-x-1">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastActivity)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.message || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {conversation.student.department}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        {conversation.student.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(conversation.student.lastActive)}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.student.profileImage} />
                    <AvatarFallback>
                      {selectedConversation.student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.student.isOnline ? 'Online' : `Last seen ${formatTime(selectedConversation.student.lastActive)}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUserId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.senderId === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-xs">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.senderId === currentUserId && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a student from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}