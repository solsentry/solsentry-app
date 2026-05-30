'use client'

import { useState, useRef, useEffect } from 'react'
import { SelectedItem } from '@/lib/cluster-data'
import { Send, Sparkles, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SenaAIChatProps {
  selectedItem: SelectedItem
}

const SUGGESTED_QUESTIONS = [
  'What makes this cluster high risk?',
  'Show me similar clusters',
  'What tokens did this cluster deploy?',
  'Analyze the rug pattern',
]

const CLUSTER_QUESTIONS = [
  'Explain the risk factors for this cluster',
  'Find connected wallets outside this cluster',
  'Show historical activity timeline',
  'Compare with other serial ruggers',
]

const WALLET_QUESTIONS = [
  'What other clusters is this wallet in?',
  'Show all tokens deployed by this wallet',
  'Trace funding sources',
  'Identify linked wallets',
]

export function SenaAIChat({ selectedItem }: SenaAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestedQuestions = selectedItem
    ? selectedItem.type === 'cluster'
      ? CLUSTER_QUESTIONS
      : WALLET_QUESTIONS
    : SUGGESTED_QUESTIONS

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getContextString = () => {
    if (!selectedItem) return ''
    if (selectedItem.type === 'cluster') {
      return `Cluster #${selectedItem.cluster.id} (${selectedItem.cluster.risk} risk, ${selectedItem.cluster.walletCount} wallets, ${selectedItem.cluster.rugRate.toFixed(1)}% rug rate)`
    }
    return `Wallet ${selectedItem.wallet.address.slice(0, 8)}...${selectedItem.wallet.address.slice(-4)} from Cluster #${selectedItem.parentCluster.id}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const context = getContextString()
      const responses = [
        `Based on my analysis of ${context || 'the available data'}, this cluster shows typical patterns of coordinated bot activity. The high deployment frequency combined with rapid liquidity pulls suggests automated rug execution.`,
        `Looking at ${context || 'the cluster data'}, I can identify several red flags: wallet age < 24h before first deploy, shared funding sources, and synchronized timing between deploys and rugs.`,
        `The risk assessment for ${context || 'this entity'} is based on: historical rug rate, connection to known bad actors, deployment velocity, and token lifecycle patterns.`,
        `Analyzing ${context || 'the provided data'}: This wallet exhibits behavior consistent with serial deployer networks - rapid token creation, minimal organic trading, and coordinated exit patterns.`,
      ]

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C17D0E] to-[#d97706] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#100E0A]" />
          </div>
          <span className="text-foreground font-medium text-sm">Sena AI</span>
          <span className="text-[10px] font-mono text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded">BETA</span>
        </div>
        {selectedItem && (
          <span className="text-[10px] font-mono text-muted-foreground">
            Context: {selectedItem.type === 'cluster' ? `Cluster #${selectedItem.cluster.id}` : `Wallet ${selectedItem.wallet.address.slice(0, 6)}...`}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="h-[180px] overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="w-8 h-8 text-muted-foreground/60 mb-2" />
            <p className="text-muted-foreground/60 text-sm">
              {selectedItem 
                ? `Ask me about ${selectedItem.type === 'cluster' ? 'this cluster' : 'this wallet'}`
                : 'Select a cluster or wallet to get contextual insights'
              }
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C17D0E] to-[#d97706] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#100E0A]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-secondary text-foreground'
                      : 'bg-background text-muted-foreground border border-border'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C17D0E] to-[#d97706] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-[#100E0A]" />
                </div>
                <div className="px-3 py-2 rounded-lg bg-background border border-border">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
        {suggestedQuestions.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(q)}
            className="flex-shrink-0 text-[10px] font-mono text-muted-foreground/60 hover:text-muted-foreground bg-background hover:bg-secondary px-2 py-1 rounded transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedItem ? 'Ask about this selection...' : 'Select a cluster first...'}
            disabled={!selectedItem}
            className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!selectedItem || !input.trim()}
            className="px-3 py-2 bg-primary hover:bg-[#d97706] disabled:bg-secondary disabled:text-muted-foreground/60 rounded-md transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-[#100E0A] disabled:text-muted-foreground/60" />
          </button>
        </div>
      </form>
    </div>
  )
}
