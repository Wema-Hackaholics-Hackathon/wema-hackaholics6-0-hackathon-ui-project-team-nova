import React, { useState } from "react";
import { Button } from "./ui/button";
import { openOkraWidget } from "../services/okraService";
import { monoLink } from "../services/monoService";

/**
 * AccountLinkWidget supports Okra widget (sandbox) and Mono mock flow.
 * When real providers are used, implement server-side token exchange.
 */
export default function AccountLinkWidget({ onLinked = () => {} }) {
  const [loading, setLoading] = useState(false);

  const handleOkra = () => {
    setLoading(true);
    openOkraWidget({
      env: "sandbox",
      publicKey:
        import.meta.env.VITE_OKRA_PUBLIC_KEY || "OKRA_PUBLIC_KEY_PLACEHOLDER",

      onSuccess: (payload) => {
        console.log("[AccountLinkWidget] okra success", payload);
        setLoading(false);
        onLinked && onLinked({ provider: "okra", payload });
      },
      onExit: () => {
        setLoading(false);
      },
    });
  };

  const handleMono = async () => {
    setLoading(true);
    try {
      const res = await monoLink();
      console.log("[AccountLinkWidget] mono mock success", res);
      onLinked && onLinked({ provider: "mono", payload: res });
    } catch (err) {
      console.error("mono link error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDevMock = () => {
    onLinked &&
      onLinked({
        provider: "mock",
        payload: {
          accounts: [{ id: "dev_acc", name: "Dev Mock", balance: 99999 }],
        },
      });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button
        onClick={handleOkra}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Linking..." : "Link with Okra (Sandbox)"}
      </Button>
      <Button
        variant="ghost"
        onClick={handleMono}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        Mono (Mock)
      </Button>
      <Button
        variant="ghost"
        onClick={handleDevMock}
        className="w-full sm:w-auto"
      >
        Dev Mock
      </Button>
    </div>
  );
}
