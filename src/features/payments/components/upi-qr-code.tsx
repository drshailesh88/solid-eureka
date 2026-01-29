'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UPIQRCodeProps {
  payeeVPA: string;
  payeeName: string;
  amount: number;
  patientName: string;
  transactionNote?: string;
}

export function UPIQRCode({
  payeeVPA,
  payeeName,
  amount,
  patientName,
  transactionNote
}: UPIQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Dynamically import upiqr to avoid SSR issues
        const upiqrModule = await import('upiqr');
        const upiqr = upiqrModule.default;

        const note = transactionNote || `Consultation - ${patientName}`;

        const result = await upiqr({
          payeeVPA,
          payeeName,
          amount: amount.toString(),
          transactionNote: note
        });

        setQrDataUrl(result.qr);
        setUpiLink(result.intent);
      } catch (err) {
        console.error('Error generating UPI QR:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    if (payeeVPA && amount > 0) {
      generateQR();
    }
  }, [payeeVPA, payeeName, amount, patientName, transactionNote]);

  const handleCopyLink = async () => {
    if (!upiLink) return;

    try {
      await navigator.clipboard.writeText(upiLink);
      setCopied(true);
      toast.success('UPI link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy UPI link');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Generating QR code...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-xs mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardContent className="flex flex-col items-center gap-4 py-6">
        {/* Amount Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(amount)}
          </p>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <img
              src={qrDataUrl}
              alt="UPI QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        )}

        {/* Payee Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Pay to: {payeeName}</p>
          <p className="font-mono text-xs">{payeeVPA}</p>
        </div>

        {/* Copy UPI Link Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          disabled={!upiLink}
          className="w-full"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy UPI Link
            </>
          )}
        </Button>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground text-center">
          Scan this QR code with any UPI app (GPay, PhonePe, Paytm, etc.)
        </p>
      </CardContent>
    </Card>
  );
}
