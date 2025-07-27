import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

export default function WalletPanel() {
  const { toast } = useToast();
  const { isConnected, account, connectWallet, ethBalance } = useWallet();

  const transactions = [
    {
      id: 1,
      type: "quest_reward",
      description: "Quest Reward",
      amount: "+0.01 ETH",
      detail: "10,000 Steps",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "challenge_reward",
      description: "Weekly Challenge",
      amount: "+0.05 ETH",
      detail: "Strength Seeker",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "boss_reward",
      description: "Boss Victory",
      amount: "+0.1 ETH",
      detail: "Couch Potato King",
      time: "3 days ago",
    },
  ];

  const handleSend = () => {
    toast({
      title: "Send ETH",
      description: "Send functionality would open MetaMask transaction dialog",
    });
  };

  const handleReceive = () => {
    toast({
      title: "Receive ETH",
      description: "Your wallet address has been copied to clipboard",
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Crypto Wallet</h3>
      
      {/* MetaMask Connection */}
      <motion.div 
        className="glassmorphism rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">MetaMask</h4>
                <p className="text-xs text-muted-foreground">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connected"}
                </p>
              </div>
            </div>
            <div className="w-3 h-3 bg-neon-green rounded-full"></div>
          </div>
        ) : (
          <div className="text-center">
            <Wallet className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">Connect Your Wallet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect MetaMask to claim your ETH rewards
            </p>
            <Button onClick={connectWallet} className="w-full">
              Connect MetaMask
            </Button>
          </div>
        )}
      </motion.div>

      {isConnected && (
        <>
          {/* ETH Balance */}
          <motion.div 
            className="glassmorphism rounded-lg p-6 mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold mb-2">{ethBalance} ETH</div>
            <div className="text-muted-foreground text-sm mb-4">≈ $4,456.32 USD</div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleSend}
                className="bg-gradient-to-r from-electric-blue to-blue-600 hover:shadow-lg hover:shadow-electric-blue/25"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button 
                onClick={handleReceive}
                className="bg-gradient-to-r from-neon-green to-green-600 hover:shadow-lg hover:shadow-neon-green/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                Receive
              </Button>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <h4 className="font-medium mb-3">Recent Transactions</h4>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div 
                key={tx.id}
                className="glassmorphism rounded-lg p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === "boss_reward" 
                        ? "bg-gold/20" 
                        : "bg-neon-green/20"
                    }`}>
                      <Plus className={`w-4 h-4 ${
                        tx.type === "boss_reward" 
                          ? "text-gold" 
                          : "text-neon-green"
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      tx.type === "boss_reward" 
                        ? "text-gold" 
                        : "text-neon-green"
                    }`}>
                      {tx.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">{tx.detail}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
