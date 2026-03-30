export type Agent = 'cnfans' | 'hipobuy' | 'sugargoo' | 'pandabuy'

export const AGENT_LABELS: Record<Agent, string> = {
  cnfans: 'CNFans',
  hipobuy: 'Hipobuy',
  sugargoo: 'Sugargoo',
  pandabuy: 'Pandabuy',
}

// Extracts Weidian item ID from a weidian.com URL
function extractWeidianId(url: string): string | null {
  const match = url.match(/[?&]itemID=(\d+)/) || url.match(/item\.weidian\.com\/(\d+)/)
  return match ? match[1] : null
}

// Extracts Taobao item ID
function extractTaobaoId(url: string): string | null {
  const match = url.match(/[?&]id=(\d+)/)
  return match ? match[1] : null
}

// Extracts 1688 item ID
function extract1688Id(url: string): string | null {
  const match = url.match(/offer\/(\d+)\.html/)
  return match ? match[1] : null
}

type ShopType = 'weidian' | 'taobao' | '1688'

function detectShopType(url: string): ShopType | null {
  if (url.includes('weidian.com')) return 'weidian'
  if (url.includes('taobao.com')) return 'taobao'
  if (url.includes('1688.com')) return '1688'
  return null
}

export function generateAgentUrl(sourceUrl: string, agent: Agent): string {
  const shopType = detectShopType(sourceUrl)
  if (!shopType) return sourceUrl

  const encoded = encodeURIComponent(sourceUrl)

  switch (agent) {
    case 'cnfans': {
      if (shopType === 'weidian') {
        const id = extractWeidianId(sourceUrl)
        return id
          ? `https://cnfans.com/product/?shop_type=weidian&id=${id}`
          : `https://cnfans.com/search-product/?search=${encoded}`
      }
      if (shopType === 'taobao') {
        const id = extractTaobaoId(sourceUrl)
        return id
          ? `https://cnfans.com/product/?shop_type=taobao&id=${id}`
          : `https://cnfans.com/search-product/?search=${encoded}`
      }
      return `https://cnfans.com/search-product/?search=${encoded}`
    }
    case 'hipobuy':
      return `https://www.hipobuy.com/product/?url=${encoded}`
    case 'sugargoo':
      return `https://www.sugargoo.com/#/home/productDetail?productLink=${encoded}`
    case 'pandabuy':
      return `https://www.pandabuy.com/product?url=${encoded}`
  }
}

export function generateAllAgentUrls(sourceUrl: string): Record<Agent, string> {
  const agents: Agent[] = ['cnfans', 'hipobuy', 'sugargoo', 'pandabuy']
  return Object.fromEntries(
    agents.map((agent) => [agent, generateAgentUrl(sourceUrl, agent)])
  ) as Record<Agent, string>
}
