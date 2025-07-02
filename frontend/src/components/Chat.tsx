import { useState, useRef, useEffect } from 'react';
import { useSendMessageMutation } from '../services/rasaApi';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

type RasaResponse = { recipient_id: string; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await sendMessage({ 
        sender: 'user', 
        message: userMessage.text 
      }).unwrap();
      
      const botResponses = (response as RasaResponse[]).map((r, index) => ({
        id: `${Date.now()}-${index}`,
        text: r.text,
        isBot: true,
        timestamp: new Date()
      }));

      setMessages(prev => [...prev, ...botResponses]);
    } catch (error) {
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        text: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // Welcome Screen - stile ChatGPT
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-semibold text-gray-800 mb-4">
                Come posso aiutarti oggi?
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                <button 
                  onClick={() => setInput("Dimmi qualcosa su di te")}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-1">Scopri di più</div>
                  <div className="text-sm text-gray-600">Dimmi qualcosa su di te</div>
                </button>
                
                <button 
                  onClick={() => setInput("Come funzioni?")}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-1">Come funzioni?</div>
                  <div className="text-sm text-gray-600">Spiegami le tue capacità</div>
                </button>
                
                <button 
                  onClick={() => setInput("Aiutami con un problema")}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-1">Risolvi un problema</div>
                  <div className="text-sm text-gray-600">Aiutami con un problema</div>
                </button>
                
                <button 
                  onClick={() => setInput("Raccontami una storia")}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-1">Creatività</div>
                  <div className="text-sm text-gray-600">Raccontami una storia</div>
                </button>
              </div>
            </div>
          ) : (
            // Messages List
            <div className="max-w-4xl mx-auto w-full px-4 py-6">
              {messages.map((message) => (
                <div key={message.id} className="mb-8">
                  <div className={`flex items-start space-x-4 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.isBot ? (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Tu</span>
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`prose prose-sm max-w-none ${message.isBot ? 'text-gray-800' : 'text-gray-800'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed m-0">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi un messaggio..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-48 min-h-[52px] text-gray-900 placeholder-gray-500"
                disabled={isLoading}
                rows={1}
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              ChatBot può commettere errori. Verifica le informazioni importanti.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}