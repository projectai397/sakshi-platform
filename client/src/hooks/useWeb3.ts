import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum === "undefined") {
      setState((prev) => ({
        ...prev,
        error: "MetaMask is not installed",
      }));
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        setState({
          provider,
          signer,
          address,
          chainId: Number(network.chainId),
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      setState((prev) => ({
        ...prev,
        error: "MetaMask is not installed. Please install MetaMask to continue.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setState({
        provider,
        signer,
        address,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message,
      }));
    }
  };

  const disconnect = () => {
    setState({
      provider: null,
      signer: null,
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  const switchNetwork = async (chainId: number) => {
    if (typeof window.ethereum === "undefined") {
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        throw new Error("Please add this network to MetaMask");
      }
      throw error;
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes (recommended by MetaMask)
    window.location.reload();
  };

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
}

// Declare ethereum on window object
declare global {
  interface Window {
    ethereum?: any;
  }
}
