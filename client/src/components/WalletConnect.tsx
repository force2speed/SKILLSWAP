import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Shield, Zap } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
  isConnected: boolean
  address?: string
}

export const WalletConnect = ({ onConnect, isConnected, address }: WalletConnectProps) => {
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-primary/20 bg-gradient-skill">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Connected</span>
          <span className="text-xs text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-8 text-center bg-gradient-card border border-primary/20">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center animate-pulse-glow">
          <Wallet className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground mb-6">
          Connect your MetaMask wallet to start bartering skills on the blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center p-4 rounded-lg border border-primary/10">
          <Shield className="w-8 h-8 text-primary mb-2" />
          <span className="text-sm font-medium">Secure</span>
          <span className="text-xs text-muted-foreground text-center">
            Blockchain-powered smart contracts
          </span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg border border-primary/10">
          <Zap className="w-8 h-8 text-skill-tech mb-2" />
          <span className="text-sm font-medium">Fast</span>
          <span className="text-xs text-muted-foreground text-center">
            Instant skill matching
          </span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg border border-primary/10">
          <Wallet className="w-8 h-8 text-skill-design mb-2" />
          <span className="text-sm font-medium">Trustless</span>
          <span className="text-xs text-muted-foreground text-center">
            No intermediaries needed
          </span>
        </div>
      </div>

      <Button 
        variant="connect" 
        size="xl" 
        onClick={onConnect}
        className="w-full"
      >
        <Wallet className="w-5 h-5" />
        Connect MetaMask
      </Button>
    </Card>
  )
}