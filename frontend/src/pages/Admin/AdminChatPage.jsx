import { useState, useEffect } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { chatAPI } from '../../api/chatAPI'

function AdminChatPage() {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const data = await chatAPI.getAllChats()
      setChats(data.chats)
    } catch (error) {
      console.error('Chats fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!message.trim() || !selectedChat) return

    try {
      await chatAPI.sendAdminMessage(selectedChat._id, message)
      setMessage('')
      fetchChats()
    } catch (error) {
      alert('Mesaj gönderilemedi')
    }
  }

  const handleCloseChat = async (chatId) => {
    if (!confirm('Bu sohbeti kapatmak istediğinizden emin misiniz?')) return

    try {
      await chatAPI.closeChat(chatId)
      fetchChats()
      setSelectedChat(null)
    } catch (error) {
      alert('Sohbet kapatılamadı')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Canlı Destek Yönetimi</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md h-[600px] overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Aktif Sohbetler ({chats.length})</h2>
          </div>

          {chats.length === 0 ? (
            <p className="text-center text-gray-600 py-8">Aktif sohbet yok</p>
          ) : (
            <div className="divide-y">
              {chats.map(chat => (
                <button
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {chat.user?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{chat.user?.name || 'Anonim'}</p>
                      <p className="text-xs text-gray-600">{chat.user?.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {chat.messages[chat.messages.length - 1]?.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.status === 'active' ? 'bg-green-100 text-green-800' :
                      chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {chat.status === 'active' ? 'Aktif' :
                       chat.status === 'waiting' ? 'Bekliyor' :
                       'Kapalı'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessage).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md h-[600px] flex flex-col">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedChat.user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold">{selectedChat.user?.name}</p>
                    <p className="text-sm text-gray-600">{selectedChat.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCloseChat(selectedChat._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-xl ${
                        msg.sender === 'admin'
                          ? 'bg-blue-600 text-white'
                          : msg.sender === 'user'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <p className="text-xs opacity-75 mb-1">Bot</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4" />
                <p>Bir sohbet seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminChatPage