import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Zap, Shield, Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  statType: string;
  statIncrease: number;
  ethCost: string;
  category: string;
  isActive: boolean;
}

export function Store() {
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/store/items"],
  }) as { data: StoreItem[], isLoading: boolean };

  const { data: character } = useQuery({
    queryKey: ["/api/character/mock-user-id"],
  }) as { data: { ethBalance: string } | undefined };

  const purchaseMutation = useMutation({
    mutationFn: async (data: { itemId: string; quantity: number }) => {
      const response = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "mock-user-id",
          itemId: data.itemId,
          quantity: data.quantity,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/character/mock-user-id"] });
      toast({
        title: "Purchase Successful!",
        description: "Your character stats have been upgraded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Not enough ETH or invalid purchase.",
        variant: "destructive",
      });
    },
  });

  const getStatIcon = (statType: string) => {
    switch (statType) {
      case "strength":
        return <TrendingUp className="h-4 w-4" />;
      case "stamina":
        return <Zap className="h-4 w-4" />;
      case "agility":
        return <Shield className="h-4 w-4" />;
      case "health":
        return <Heart className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getStatColor = (statType: string) => {
    switch (statType) {
      case "strength":
        return "text-red-400";
      case "stamina":
        return "text-blue-400";
      case "agility":
        return "text-green-400";
      case "health":
        return "text-pink-400";
      default:
        return "text-gray-400";
    }
  };

  const handlePurchase = (itemId: string) => {
    purchaseMutation.mutate({ itemId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Hero Upgrade Store</h2>
        <div className="flex items-center gap-2 text-yellow-400">
          <Coins className="h-5 w-5" />
          <span className="font-mono">
            {character ? parseFloat(character.ethBalance).toFixed(4) : "0.0000"} ETH
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: StoreItem) => (
          <Card
            key={item.id}
            className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <span className={getStatColor(item.statType)}>
                    {getStatIcon(item.statType)}
                  </span>
                  {item.name}
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-400">Boosts </span>
                  <span className={`capitalize ${getStatColor(item.statType)}`}>
                    {item.statType}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  +{item.statIncrease}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Coins className="h-4 w-4" />
                  <span className="font-mono">{item.ethCost} ETH</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePurchase(item.id)}
                  disabled={
                    purchaseMutation.isPending ||
                    !character ||
                    parseFloat(character.ethBalance) < parseFloat(item.ethCost)
                  }
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {purchaseMutation.isPending ? "Buying..." : "Purchase"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No items available in the store.</p>
        </div>
      )}
    </div>
  );
}