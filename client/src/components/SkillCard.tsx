import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Star, Users } from "lucide-react"

interface SkillCardProps {
  id: string
  userAddress: string
  userName: string
  skillOffered: string
  skillRequested: string
  description: string
  availability: string
  reputation: number
  category: "tech" | "design" | "business" | "language"
  onMatch: (id: string) => void
}

const categoryColors = {
  tech: "bg-skill-tech/20 text-skill-tech border-skill-tech/30",
  design: "bg-skill-design/20 text-skill-design border-skill-design/30",
  business: "bg-skill-business/20 text-skill-business border-skill-business/30",
  language: "bg-skill-language/20 text-skill-language border-skill-language/30"
}

export const SkillCard = ({
  id,
  userAddress,
  userName,
  skillOffered,
  skillRequested,
  description,
  availability,
  reputation,
  category,
  onMatch
}: SkillCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{userName}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3 h-3 fill-current text-skill-business" />
              <span>{reputation}</span>
            </div>
          </div>
        </div>
        <Badge className={categoryColors[category]}>
          {category}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span className="text-sm font-medium text-skill-tech">Offering:</span>
          <p className="font-semibold">{skillOffered}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-skill-design">Looking for:</span>
          <p className="font-semibold">{skillRequested}</p>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{availability}</span>
      </div>

      <Button 
        variant="skill" 
        className="w-full"
        onClick={() => onMatch(id)}
      >
        <Users className="w-4 h-4" />
        Request Match
      </Button>
    </Card>
  )
}