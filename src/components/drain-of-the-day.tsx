"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

// Types
interface WalletNode {
  id: string
  address: string
  amount: number
  time: string
  type: "victim" | "split" | "hop" | "consolidation" | "cex"
  tag?: string
  round: number
  position: number
}

interface Edge {
  from: string
  to: string
  amount: number
}

interface NodePosition {
  x: number
  y: number
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Mock data - realistic drain scenario
const MOCK_DRAIN_DATA = {
  detectedAgo: "4h",
  totalAmount: 8247,
  totalUsd: 1400000,
  victimAddress: "VictimWallet...3xK",
  destinationCex: "Binance",
  hops: 7,
  duration: "4h 12m",
  nodes: [
    { id: "v1", address: "Victim...3xK", amount: 8247, time: "14:23", type: "victim", round: 0, position: 0 },
    { id: "s1", address: "7kPq...mN4x", amount: 2749, time: "14:24", type: "split", tag: "mixer", round: 1, position: 0 },
    { id: "s2", address: "3jRv...pL8w", amount: 2749, time: "14:24", type: "split", tag: "mixer", round: 1, position: 1 },
    { id: "s3", address: "9mTx...kQ2y", amount: 2749, time: "14:25", type: "split", tag: "mixer", round: 1, position: 2 },
    { id: "h1", address: "4nYu...zR5t", amount: 1832, time: "15:03", type: "hop", round: 2, position: 0 },
    { id: "h2", address: "8wKp...bV7s", amount: 917, time: "15:08", type: "hop", round: 2, position: 1 },
    { id: "h3", address: "2qLm...xC4r", amount: 1649, time: "15:12", type: "hop", round: 2, position: 2 },
    { id: "h4", address: "6tHn...aD9e", amount: 1100, time: "15:18", type: "hop", round: 2, position: 3 },
    { id: "h5", address: "1sGk...fW3v", amount: 2749, time: "15:22", type: "hop", tag: "known", round: 2, position: 4 },
    { id: "c1", address: "5pJr...gY6u", amount: 3666, time: "17:45", type: "consolidation", tag: "fast_deployer", round: 3, position: 0 },
    { id: "c2", address: "4xMq...hZ8i", amount: 4581, time: "17:52", type: "consolidation", tag: "fast_deployer", round: 3, position: 1 },
    { id: "cex1", address: "Binance Hot", amount: 8247, time: "18:35", type: "cex", tag: "CEX", round: 4, position: 0 },
  ] as WalletNode[],
  edges: [
    { from: "v1", to: "s1", amount: 2749 },
    { from: "v1", to: "s2", amount: 2749 },
    { from: "v1", to: "s3", amount: 2749 },
    { from: "s1", to: "h1", amount: 1832 },
    { from: "s1", to: "h2", amount: 917 },
    { from: "s2", to: "h3", amount: 1649 },
    { from: "s2", to: "h4", amount: 1100 },
    { from: "s3", to: "h5", amount: 2749 },
    { from: "h1", to: "c1", amount: 1832 },
    { from: "h2", to: "c1", amount: 917 },
    { from: "h3", to: "c1", amount: 917 },
    { from: "h3", to: "c2", amount: 732 },
    { from: "h4", to: "c2", amount: 1100 },
    { from: "h5", to: "c2", amount: 2749 },
    { from: "c1", to: "cex1", amount: 3666 },
    { from: "c2", to: "cex1", amount: 4581 },
  ] as Edge[],
}

// Icons
function ZoomInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  )
}

function ZoomOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M8 11h6" />
    </svg>
  )
}

function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  )
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
    </svg>
  )
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function MoveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
    </svg>
  )
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

// Node component
function BracketNode({ 
  node, 
  x, 
  y, 
  isHighlighted,
  isDragging,
  onHover,
  onClick,
  onDragStart,
  onDrag,
  onDragEnd,
}: { 
  node: WalletNode
  x: number
  y: number
  isHighlighted: boolean
  isDragging: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
  onDragStart: (id: string, e: React.MouseEvent) => void
  onDrag: (id: string, dx: number, dy: number) => void
  onDragEnd: () => void
}) {
  const width = 130
  const height = 60
  const dragRef = useRef<{ startX: number; startY: number; dragging: boolean }>({ startX: 0, startY: 0, dragging: false })

  const getBorderColor = () => {
    if (isHighlighted) return "#C17D0E"
    if (node.type === "victim") return "#ef4444"
    if (node.type === "cex") return "#22c55e"
    return "#2A251C"
  }

  const getTagColor = () => {
    switch (node.tag) {
      case "mixer": return "#C17D0E"
      case "CEX": return "#22c55e"
      case "fast_deployer": return "#ef4444"
      case "known": return "#eab308"
      default: return "#5A5448"
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: true }
    onDragStart(node.id, e)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current.dragging) return
      const dx = moveEvent.clientX - dragRef.current.startX
      const dy = moveEvent.clientY - dragRef.current.startY
      onDrag(node.id, dx, dy)
      dragRef.current.startX = moveEvent.clientX
      dragRef.current.startY = moveEvent.clientY
    }

    const handleMouseUp = () => {
      dragRef.current.dragging = false
      onDragEnd()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <g
      transform={`translate(${x - width / 2}, ${y - height / 2})`}
      onMouseEnter={() => !isDragging && onHover(node.id)}
      onMouseLeave={() => !isDragging && onHover(null)}
      onClick={() => !isDragging && onClick(node.id)}
      onMouseDown={handleMouseDown}
      className={cn("cursor-grab", isDragging && "cursor-grabbing")}
      style={{ userSelect: "none" }}
    >
      {/* Glow effect for highlighted */}
      {isHighlighted && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={12}
          fill="none"
          stroke="#C17D0E"
          strokeWidth={1}
          opacity={0.3}
          filter="blur(4px)"
        />
      )}

      {/* Node background */}
      <rect
        width={width}
        height={height}
        rx={8}
        fill="#1F1B14"
        stroke={getBorderColor()}
        strokeWidth={isHighlighted ? 2 : 1}
        className="transition-all duration-200"
      />
      
      {/* Victim pulse effect */}
      {node.type === "victim" && (
        <rect
          width={width}
          height={height}
          rx={8}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1}
          opacity={0.4}
          className="animate-pulse"
        />
      )}

      {/* Address */}
      <text
        x={width / 2}
        y={18}
        textAnchor="middle"
        fill="#F2EDE4"
        fontSize={11}
        fontFamily="var(--font-jetbrains-mono), monospace"
      >
        {node.address}
      </text>

      {/* Amount */}
      <text
        x={width / 2}
        y={36}
        textAnchor="middle"
        fill={node.type === "victim" ? "#ef4444" : node.type === "cex" ? "#22c55e" : "#C17D0E"}
        fontSize={13}
        fontWeight="600"
        fontFamily="var(--font-jetbrains-mono), monospace"
      >
        {node.amount.toLocaleString()} SOL
      </text>

      {/* Time + Tag row */}
      <g transform={`translate(0, 46)`}>
        <text
          x={node.tag ? 10 : width / 2}
          y={8}
          textAnchor={node.tag ? "start" : "middle"}
          fill="#5A5448"
          fontSize={9}
          fontFamily="var(--font-jetbrains-mono), monospace"
        >
          {node.time}
        </text>
        
        {node.tag && (
          <>
            <rect
              x={width - 10 - node.tag.length * 5.5}
              y={-4}
              width={node.tag.length * 5.5 + 10}
              height={16}
              rx={8}
              fill={getTagColor()}
              opacity={0.2}
            />
            <text
              x={width - 6}
              y={7}
              textAnchor="end"
              fill={getTagColor()}
              fontSize={9}
              fontWeight="500"
              fontFamily="var(--font-inter), sans-serif"
            >
              {node.tag}
            </text>
          </>
        )}
      </g>
    </g>
  )
}

// Edge component
function BracketEdge({
  fromX,
  fromY,
  toX,
  toY,
  amount,
  isHighlighted,
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
  amount: number
  isHighlighted: boolean
}) {
  const midX = (fromX + toX) / 2
  const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={isHighlighted ? "#C17D0E" : "#2A251C"}
        strokeWidth={isHighlighted ? 2 : 1}
        className="transition-all duration-200"
      />
      
      {isHighlighted && (
        <path
          d={path}
          fill="none"
          stroke="#C17D0E"
          strokeWidth={2}
          strokeDasharray="6 4"
          className="animate-flow"
        />
      )}

      <text
        x={midX}
        y={(fromY + toY) / 2 - 8}
        textAnchor="middle"
        fill={isHighlighted ? "#C17D0E" : "#5A5448"}
        fontSize={10}
        fontFamily="var(--font-jetbrains-mono), monospace"
        className="transition-colors duration-200"
      >
        {amount.toLocaleString()}
      </text>

      {/* Arrow */}
      <polygon
        points={`${toX - 8},${toY - 4} ${toX},${toY} ${toX - 8},${toY + 4}`}
        fill={isHighlighted ? "#C17D0E" : "#2A251C"}
        className="transition-colors duration-200"
      />
    </g>
  )
}

// Sena AI Chat Panel
function SenaChat({ 
  isOpen, 
  onClose,
  initialContext 
}: { 
  isOpen: boolean
  onClose: () => void
  initialContext: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: initialContext,
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "mixer": "Os 3 mixers identificados (7kPq...mN4x, 3jRv...pL8w, 9mTx...kQ2y) fazem parte do cluster #847, conhecido por processar drains similares. Taxa de sucesso de lavagem: 78%.",
        "binance": "O hot wallet da Binance recebeu os fundos às 18:35. Estimativa de liquidação: 2-4h após depósito baseado em padrões históricos deste cluster.",
        "fast": "O padrão 'fast-cashout' é caracterizado por: split inicial em 3+ wallets, consolidação em menos de 4h, e destino final em CEX tier-1. Detectamos 8 eventos similares nos últimos 7 dias.",
        "cluster": "Cluster #847 inclui 23 wallets identificadas, com 91.9% de taxa de rug. Operador principal: 4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1 (serial_deployer).",
        "recover": "Infelizmente, uma vez que os fundos chegaram ao CEX, a recuperação depende de ação legal junto à exchange. Recomendamos reportar o incidente à Binance com os hashes das transações.",
      }
      
      let response = "Posso ajudar com mais detalhes sobre este drain. Pergunte sobre os mixers, o cluster de operadores, padrões de cashout, ou possibilidades de recuperação."
      
      const lowerInput = userMessage.toLowerCase()
      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value
          break
        }
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1200)
  }

  if (!isOpen) return null

  return (
    <div 
      className="absolute bottom-0 right-0 w-[400px] h-[450px] bg-popover border border-border rounded-lg shadow-xl flex flex-col z-50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">AI</span>
          </div>
          <div>
            <span className="text-foreground font-medium text-sm">Sena AI</span>
            <span className="text-muted-foreground/60 text-xs ml-2">Drain Analyst</span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-primary text-[#100E0A]" 
                : "bg-card border border-border text-muted-foreground"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte sobre este drain..."
            className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-3 py-2 bg-primary text-[#100E0A] rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
          Pergunte sobre mixers, clusters, padrões ou recuperação
        </p>
      </div>
    </div>
  )
}

export function DrainOfTheDay() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({})
  
  const containerRef = useRef<HTMLDivElement>(null)
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  
  const data = MOCK_DRAIN_DATA

  // Initialize node positions
  useEffect(() => {
    const svgWidth = 1100
    const svgHeight = 450
    const roundSpacing = 200
    const startX = 100

    const positions: Record<string, NodePosition> = {}
    data.nodes.forEach(node => {
      const x = startX + node.round * roundSpacing
      const nodesInRound = data.nodes.filter(n => n.round === node.round).length
      const totalHeight = (nodesInRound - 1) * 80
      const startY = (svgHeight - totalHeight) / 2
      const y = startY + node.position * 80
      positions[node.id] = { x, y }
    })
    setNodePositions(positions)
  }, [data.nodes])

  // Calculate highlighted path
  const getHighlightedPath = useCallback((nodeId: string | null): Set<string> => {
    if (!nodeId) return new Set()
    
    const highlighted = new Set<string>([nodeId])
    
    const findPathsForward = (currentId: string) => {
      data.edges
        .filter(e => e.from === currentId)
        .forEach(edge => {
          highlighted.add(edge.to)
          findPathsForward(edge.to)
        })
    }
    
    const findPathsBackward = (currentId: string) => {
      data.edges
        .filter(e => e.to === currentId)
        .forEach(edge => {
          highlighted.add(edge.from)
          findPathsBackward(edge.from)
        })
    }
    
    findPathsForward(nodeId)
    findPathsBackward(nodeId)
    
    return highlighted
  }, [data.edges])

  const highlightedNodes = getHighlightedPath(hoveredNode)

  const isEdgeHighlighted = (edge: Edge) => {
    return highlightedNodes.has(edge.from) && highlightedNodes.has(edge.to)
  }

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Pan handling
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).tagName === "svg") {
      setIsPanning(true)
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x
      const dy = e.clientY - panStartRef.current.y
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      })
    }
  }

  const handleCanvasMouseUp = () => {
    setIsPanning(false)
  }

  // Node drag handling
  const handleNodeDragStart = (id: string) => {
    setDraggingNode(id)
  }

  const handleNodeDrag = (id: string, dx: number, dy: number) => {
    setNodePositions(prev => ({
      ...prev,
      [id]: {
        x: prev[id].x + dx / zoom,
        y: prev[id].y + dy / zoom,
      }
    }))
  }

  const handleNodeDragEnd = () => {
    setDraggingNode(null)
  }

  const handleNodeClick = (id: string) => {
    const node = data.nodes.find(n => n.id === id)
    if (node) {
      console.log(`Navigate to wallet: ${node.address}`)
    }
  }

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  const svgWidth = 1100
  const svgHeight = 450

  const aiNarrative = `Funds split across 3 mixer wallets, consolidated through 2 known fast-deployer wallets (cluster #847), terminated at Binance hot wallet in ${data.duration}. Pattern matches 'fast-cashout' template (8 similar events 7d).`

  const cardContent = (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-popover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg text-[#ef4444]">&#9660;</span>
            <h2 className="text-foreground font-semibold">Drain of the Day</h2>
            <span className="text-muted-foreground/60 text-sm">· last 24h</span>
          </div>
          <span className="text-muted-foreground/60 text-sm font-mono">
            detected {data.detectedAgo} ago
          </span>
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          <span className="font-mono text-primary font-semibold">
            {data.totalAmount.toLocaleString()} SOL
          </span>
          <span className="text-muted-foreground/60"> (${(data.totalUsd / 1000000).toFixed(1)}M)</span>
          {" "}drained from{" "}
          <span className="font-mono text-[#ef4444]">{data.victimAddress}</span>
          {" "}to{" "}
          <span className="text-[#22c55e]">{data.destinationCex}</span>
          {" "}via{" "}
          <span className="font-mono">{data.hops} hops</span>
        </p>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-border bg-background flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom out"
          >
            <ZoomOutIcon />
          </button>
          <span className="text-muted-foreground/60 text-xs font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom in"
          >
            <ZoomInIcon />
          </button>
          <div className="w-px h-4 bg-secondary mx-2" />
          <button
            onClick={handleResetView}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Reset view"
          >
            <ResetIcon />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/60 text-xs">
          <MoveIcon className="w-3 h-3" />
          <span>Drag nodes to rearrange</span>
        </div>
      </div>

      {/* Bracket Visualization */}
      <div 
        ref={containerRef}
        className={cn(
          "overflow-hidden bg-background",
          isPanning ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ height: isFullscreen ? "calc(100vh - 280px)" : "450px" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Round labels */}
          {["Victim", "Split", "Hops", "Consolidation", "CEX"].map((label, i) => (
            <text
              key={label}
              x={100 + i * 200}
              y={24}
              textAnchor="middle"
              fill="#5A5448"
              fontSize={11}
              fontFamily="var(--font-inter), sans-serif"
              fontWeight="500"
              letterSpacing="0.05em"
            >
              {label.toUpperCase()}
            </text>
          ))}

          {/* Edges */}
          {data.edges.map((edge, i) => {
            const fromPos = nodePositions[edge.from]
            const toPos = nodePositions[edge.to]
            if (!fromPos || !toPos) return null
            
            return (
              <BracketEdge
                key={i}
                fromX={fromPos.x + 65}
                fromY={fromPos.y}
                toX={toPos.x - 65}
                toY={toPos.y}
                amount={edge.amount}
                isHighlighted={isEdgeHighlighted(edge)}
              />
            )
          })}

          {/* Nodes */}
          {data.nodes.map(node => {
            const pos = nodePositions[node.id]
            if (!pos) return null
            
            return (
              <BracketNode
                key={node.id}
                node={node}
                x={pos.x}
                y={pos.y}
                isHighlighted={highlightedNodes.has(node.id)}
                isDragging={draggingNode === node.id}
                onHover={setHoveredNode}
                onClick={handleNodeClick}
                onDragStart={handleNodeDragStart}
                onDrag={handleNodeDrag}
                onDragEnd={handleNodeDragEnd}
              />
            )
          })}
        </svg>
      </div>

      {/* AI Narrative - Clickable */}
      <div 
        className="px-6 py-4 border-t border-border bg-popover cursor-pointer hover:bg-card transition-colors group relative"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-primary text-xs font-bold">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">Sena AI:</span>{" "}
              Funds split across 3 mixer wallets, consolidated through 2 known
              fast-deployer wallets{" "}
              <span className="font-mono text-muted-foreground/60">(cluster #847)</span>, 
              terminated at Binance hot wallet in {data.duration}. Pattern matches{" "}
              <span className="text-primary">&apos;fast-cashout&apos;</span>{" "}
              template <span className="text-muted-foreground/60">(8 similar events 7d)</span>.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 text-muted-foreground/60 group-hover:text-primary transition-colors">
            <ChatIcon className="w-4 h-4" />
            <span className="text-xs">Chat</span>
          </div>
        </div>

        {/* Chat Panel */}
        <SenaChat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          initialContext={aiNarrative}
        />
      </div>

      {/* CTA Row */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between">
        <p className="text-muted-foreground/60 text-xs">
          Hover nodes to trace fund flow · Drag to rearrange
        </p>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Export PDF (B2B)
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-[#100E0A] hover:bg-primary/90 transition-colors flex items-center gap-2">
            View full trace
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="w-full h-full flex flex-col">
          <div 
            className="flex-1 rounded-none border-0 bg-card overflow-hidden flex flex-col"
            style={{ boxShadow: "none" }}
          >
            {cardContent}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div 
        className="rounded-lg border border-border bg-card overflow-hidden relative"
        style={{ boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)" }}
      >
        {cardContent}
      </div>
    </div>
  )
}
