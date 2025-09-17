import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnect } from "@/components/WalletConnect";
import { SkillCard } from "@/components/SkillCard";
import { MatchCard,MatchCardProps } from "@/components/MatchCard";
import { Brain, Plus, Search, Trophy, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-brain.jpg";
import { getContract } from "@/utils/contract";

// ---------------- TYPES ----------------
interface Skill {
  owner: string;
  skillOffered: string;
  skillRequested: string;
  description: string;
  duration: number; // in hours
  category: string;
}

interface Match {
  id: string;
  skillId: string;
  requester: string;
  confirmed: boolean;
}

// ---------------- COMPONENT ----------------
const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
  const [activeTab, setActiveTab] = useState("discover");

  const [contract, setContract] = useState<any>(null);

  // Form states
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState(""); // input as string, converted to number
  const [category, setCategory] = useState("");

  // On-chain states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // ---------------- WALLET ----------------
  async function handleConnect() {
    if (!(window as any).ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      setUserAddress(accounts[0]);
      setIsConnected(true);

      const c = await getContract();
      setContract(c);

      toast({
        title: "Wallet Connected",
        description: `Connected as ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });

      // Fetch existing skills + matches
      await fetchSkills(c);
      await fetchMatches(c);
    } catch (err) {
      console.error(err);
      toast({
        title: "Connection Failed",
        description: "Could not connect wallet",
        variant: "destructive",
      });
    }
  }

  // ---------------- CONTRACT CALLS ----------------
  async function fetchSkills(c = contract) {
    if (!c) return;
    try {
      const offers = await c.getActiveOffers();
      const mappedSkills = offers.map((o: any) => ({
  owner: o.provider,
  skillOffered: o.skillOffered,
  skillWanted: o.skillRequested,
  description: o.description,
  duration: o.duration?._hex ? parseInt(o.duration._hex) : Number(o.duration) || 0,
  category: "tech", // placeholder
}));

      setSkills(mappedSkills);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    }
  }

  async function fetchMatches(c = contract) {
    if (!c) return;
    try {
      if (c.getUserMatches) {
        const userMatches = await c.getUserMatches();
        setMatches(userMatches);
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  }

  async function handlePostSkill() {
    if (!contract)
      return toast({ title: "Error", description: "Wallet not connected" });

    if (!skillOffered || !skillRequested || !description || !availability || !category) {
      return toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }

    const durationNumber = parseInt(availability);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      return toast({
        title: "Error",
        description: "Availability must be a positive number (hours)",
        variant: "destructive",
      });
    }

    try {
      const tx = await contract.postSkill(
        skillOffered,
        skillRequested,
        description,
        durationNumber
      );
      await tx.wait();

      toast({
        title: "Skill Posted",
        description: "Your skill offer has been added to the blockchain!",
      });

      // Reset form
      setSkillOffered("");
      setSkillRequested("");
      setDescription("");
      setAvailability("");
      setCategory("");

      await fetchSkills();
    } catch (err: any) {
      console.error("Error posting skill:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to post skill",
        variant: "destructive",
      });
    }
  }

  async function handleMatch(skillId: string) {
    if (!contract) return;
    try {
      const tx = await contract.requestMatch(skillId);
      await tx.wait();

      toast({
        title: "Match Requested",
        description: "Your match request has been sent!",
      });

      await fetchMatches();
    } catch (err) {
      console.error("Error matching:", err);
      toast({
        title: "Error",
        description: "Failed to request match",
        variant: "destructive",
      });
    }
  }

  async function handleConfirm(matchId: string) {
    if (!contract) return;
    try {
      const tx = await contract.confirmCompletion(matchId);
      await tx.wait();
      toast({
        title: "Completion Confirmed",
        description: "Your confirmation has been recorded on the blockchain",
      });

      await fetchMatches();
    } catch (err) {
      console.error("Error confirming:", err);
      toast({
        title: "Error",
        description: "Failed to confirm match",
        variant: "destructive",
      });
    }
  }

  // ---------------- UI ----------------
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Blockchain skill exchange visualization"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-hero opacity-80" />
          </div>

          <div className="relative container mx-auto px-4 py-20 text-center">
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-16 h-16 text-primary animate-float" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              SkillSwap
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The world's first peer-to-peer skill barter platform powered by
              blockchain. Trade knowledge, not money.
            </p>
          </div>
        </section>

        {/* Connect Section */}
        <section className="container mx-auto px-4 py-20">
          <WalletConnect
            onConnect={handleConnect}
            isConnected={isConnected}
            address={userAddress}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">SkillSwap</h1>
            </div>
            <WalletConnect
              onConnect={handleConnect}
              isConnected={isConnected}
              address={userAddress}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="post">
              <Plus className="w-4 h-4 mr-2" />
              Post Skill
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Users className="w-4 h-4 mr-2" />
              My Matches
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="Search skills..." className="flex-1" />
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, idx) => (
                <SkillCard
                  key={idx}
                  id={idx.toString()}
                  userAddress={skill.owner}
                  userName={skill.owner.slice(0, 6) + "..." + skill.owner.slice(-4)}
                  skillOffered={skill.skillOffered}
                  skillRequested={skill.skillRequested}
                  description={skill.description}
                  availability={skill.duration.toString()} // number of hours
                  reputation={0}
                  category={
                    ["tech", "design", "business", "language"].includes(skill.category)
                      ? (skill.category as "tech" | "design" | "business" | "language")
                      : "tech"
                  }
                  onMatch={handleMatch}
                />
              ))}
            </div>
          </TabsContent>

          {/* Post Skill Tab */}
          <TabsContent value="post" className="space-y-6">
            <Card className="p-6 bg-gradient-card border border-primary/20">
              <h2 className="text-2xl font-bold mb-6">Post Your Skill</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Skill You're Offering
                  </label>
                  <Input
                    placeholder="e.g., Python Programming, Graphic Design"
                    value={skillOffered}
                    onChange={(e) => setSkillOffered(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Skill You Want to Learn
                  </label>
                  <Input
                    placeholder="e.g., Spanish Language, Photography"
                    value={skillRequested}
                    onChange={(e) => setSkillRequested(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="language">Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe your expertise and what you can teach..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (hours)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  />
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handlePostSkill}
                >
                  <Plus className="w-5 h-5" />
                  Post to Blockchain
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {matches.map((match): JSX.Element => {
  const cardProps: MatchCardProps = {
    matchId: match.id,
    partnerName: match.requester.slice(0, 6) + "..." + match.requester.slice(-4),
    partnerAddress: match.requester,
    mySkill: "MySkillPlaceholder",
    partnerSkill: "PartnerSkillPlaceholder",
    status: match.confirmed ? "completed" : "active",
    confirmedByMe: false,
    confirmedByPartner: match.confirmed,
    onConfirm: handleConfirm,
  };
  return <MatchCard key={match.id} {...cardProps} />;
})}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
