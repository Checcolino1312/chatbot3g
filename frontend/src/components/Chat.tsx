import { useState } from 'react';
import { useSendMessageMutation } from '../services/rasaApi';

type RasaResponse = { recipient_id: string; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [sendMessage] = useSendMessageMutation();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = `🧑: ${input}`;
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage({ sender: 'user', message: input }).unwrap();
      const botMessages = (response as RasaResponse[]).map((r) => `🤖: ${r.text}`);
      setMessages(prev => [...prev, ...botMessages]);
    } catch {
      setMessages(prev => [...prev, '⚠️ Errore nella comunicazione con Rasa.']);
    }

    setInput('');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="h-96 overflow-y-auto border p-2 mb-4 rounded bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1 whitespace-pre-wrap">{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        className="border p-2 w-full rounded"
        placeholder="Scrivi un messaggio..."
      />
    </div>
  );
}
