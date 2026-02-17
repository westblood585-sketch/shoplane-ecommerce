import { useState, useEffect } from 'react'
import { Gift, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../api/axiosConfig'

function GiftWrapSelector({ selectedWrap, onSelect, onRemove }) {
    const [giftWraps, setGiftWraps] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMessageForm, setShowMessageForm] = useState(false)
    const [giftMessage, setGiftMessage] = useState({
        message: '',
        from: '',
        to: ''
    })

    useEffect(() => {
        fetchGiftWraps()
    }, [])

    const fetchGiftWraps = async () => {
        try {
            const response = await API.get('/gift-wraps')
            setGiftWraps(response.data.giftWraps || [])
        } catch (error) {
            console.error('Error fetching gift wraps:', error)
            setGiftWraps([])
        } finally {
            setLoading(false)
        }
    }

    const handleSelectWrap = (wrap) => {
        onSelect({
            ...wrap,
            giftMessage: showMessageForm ? giftMessage : null
        })
        setShowMessageForm(true)
    }

    const handleMessageChange = (field, value) => {
        const updatedMessage = {
            ...giftMessage,
            [field]: value
        }
        setGiftMessage(updatedMessage)

        if (selectedWrap) {
            onSelect({
                ...selectedWrap,
                giftMessage: updatedMessage
            })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* No Wrap Option */}
            <button
                onClick={onRemove}
                className={`w-full p-4 rounded-xl border-2 transition-all ${!selectedWrap
                        ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <X size={24} className="text-gray-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold dark:text-dark-text">Hediye Paketi İstemiyorum</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Ücretsiz</p>
                        </div>
                    </div>
                    {!selectedWrap && (
                        <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                        </div>
                    )}
                </div>
            </button>

            {/* Gift Wrap Options */}
            {giftWraps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {giftWraps.map((wrap) => (
                        <button
                            key={wrap._id}
                            onClick={() => handleSelectWrap(wrap)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedWrap?._id === wrap._id
                                    ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: wrap.color + '20' }}
                                    >
                                        {wrap.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold dark:text-dark-text">{wrap.name}</p>
                                        {wrap.isPremium && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                                Premium
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {selectedWrap?._id === wrap._id && (
                                    <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center">
                                        <Check size={16} className="text-white" />
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {wrap.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {wrap.includesCard && <span>📝 Mesaj Kartı</span>}
                                    {wrap.includesRibbon && <span>🎀 Kurdele</span>}
                                </div>
                                <span className="font-bold text-pink-600">₺{wrap.price}</span>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Gift size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Şu anda hediye paketi seçeneği bulunmamaktadır</p>
                </div>
            )}

            {/* Gift Message Form */}
            <AnimatePresence>
                {selectedWrap && showMessageForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-6 space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="text-pink-600" size={20} />
                            <h4 className="font-semibold dark:text-dark-text">Hediye Mesajı (İsteğe Bağlı)</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-dark-text">
                                Mesajınız
                            </label>
                            <textarea
                                value={giftMessage.message}
                                onChange={(e) => handleMessageChange('message', e.target.value)}
                                maxLength={selectedWrap.maxMessageLength}
                                rows={3}
                                placeholder="Hediye mesajınızı yazın..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {giftMessage.message.length} / {selectedWrap.maxMessageLength} karakter
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-dark-text">
                                    Gönderen
                                </label>
                                <input
                                    type="text"
                                    value={giftMessage.from}
                                    onChange={(e) => handleMessageChange('from', e.target.value)}
                                    placeholder="Adınız"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-dark-text">
                                    Alıcı
                                </label>
                                <input
                                    type="text"
                                    value={giftMessage.to}
                                    onChange={(e) => handleMessageChange('to', e.target.value)}
                                    placeholder="Alıcı adı"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Wrap Summary */}
            {selectedWrap && (
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedWrap.icon}</span>
                        <div>
                            <p className="font-semibold dark:text-dark-text">{selectedWrap.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hediye paketi seçildi
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-pink-600">₺{selectedWrap.price}</p>
                        <button
                            onClick={onRemove}
                            className="text-sm text-gray-500 hover:text-red-600 transition"
                        >
                            Kaldır
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GiftWrapSelector