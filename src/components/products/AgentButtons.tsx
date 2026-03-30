'use client'

import { generateAgentUrl, AGENT_LABELS, type Agent } from '@/lib/utils/agents'

const AGENTS: Agent[] = ['cnfans', 'hipobuy', 'sugargoo', 'pandabuy']

const AGENT_COLORS: Record<Agent, string> = {
  cnfans: 'bg-orange-500/10 border-orange-500/30 text-orange-300 hover:bg-orange-500/20',
  hipobuy: 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20',
  sugargoo: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20',
  pandabuy: 'bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20',
}

export function AgentButtons({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div>
      <p className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Acheter via</p>
      <div className="grid grid-cols-2 gap-2">
        {AGENTS.map(agent => (
          <a
            key={agent}
            href={generateAgentUrl(sourceUrl, agent)}
            target="_blank"
            rel="noopener noreferrer"
            className={`border rounded-xl px-4 py-2.5 text-sm font-medium text-center transition-colors ${AGENT_COLORS[agent]}`}
          >
            {AGENT_LABELS[agent]}
          </a>
        ))}
      </div>
    </div>
  )
}
