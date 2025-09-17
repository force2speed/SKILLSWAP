import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, Clock, ArrowLeftRight } from "lucide-react"

export interface MatchCardProps {
  matchId: string
  partnerName: string
  partnerAddress: string
  mySkill: string
  partnerSkill: string
  status: "pending" | "active" | "completed"
  confirmedByMe: boolean
  confirmedByPartner: boolean
  onConfirm: (matchId: string) => void
}

const statusColors = {
  pending: "bg-skill-business/20 text-skill-business border-skill-business/30",
  active: "bg-skill-tech/20 text-skill-tech border-skill-tech/30",
  completed: "bg-skill-language/20 text-skill-language border-skill-language/30"
}

export const MatchCard = ({
  matchId,
  partnerName,
  partnerAddress,
  mySkill,
  partnerSkill,
  status,
  confirmedByMe,
  confirmedByPartner,
  onConfirm
}: MatchCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card border border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {partnerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{partnerName}</h3>
            <span className="text-sm text-muted-foreground">
              {partnerAddress.slice(0, 8)}...
            </span>
          </div>
        </div>
        <Badge className={statusColors[status]}>
          {status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground">You teach</p>
          <p className="font-semibold text-skill-tech">{mySkill}</p>
        </div>
        <ArrowLeftRight className="w-5 h-5 text-primary" />
        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground">You learn</p>
          <p className="font-semibold text-skill-design">{partnerSkill}</p>
        </div>
      </div>

      {status === "active" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {confirmedByMe ? (
                <CheckCircle className="w-4 h-4 text-skill-language" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span>Your confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              {confirmedByPartner ? (
                <CheckCircle className="w-4 h-4 text-skill-language" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span>Partner confirmation</span>
            </div>
          </div>

          {!confirmedByMe && (
            <Button 
              variant="skill" 
              className="w-full"
              onClick={() => onConfirm(matchId)}
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Completion
            </Button>
          )}
        </div>
      )}

      {status === "completed" && (
        <div className="text-center text-skill-language font-medium">
          ✅ Skill exchange completed successfully!
        </div>
      )}
    </Card>
  )
}