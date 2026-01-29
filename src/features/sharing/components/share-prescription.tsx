'use client';

import { useState } from 'react';
import {
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SharePrescriptionProps {
  prescriptionId: string;
  pdfUrl: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
}

export function SharePrescription({
  prescriptionId,
  pdfUrl,
  patientName,
  patientPhone,
  patientEmail
}: SharePrescriptionProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(patientEmail || '');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const shareMessage = `Prescription for ${patientName}\n\nView/Download: ${pdfUrl}`;
  const shareTitle = `Prescription - ${patientName}`;

  const handleEmailSend = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId,
          email,
          patientName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSent(true);
      toast.success('Prescription sent successfully!');
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format phone for WhatsApp (add country code if missing)
  const formatWhatsAppPhone = (phone?: string) => {
    if (!phone) return '';
    // Remove non-digits
    const digits = phone.replace(/\D/g, '');
    // Add India country code if not present
    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  };

  const whatsappPhone = formatWhatsAppPhone(patientPhone);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Prescription</DialogTitle>
          <DialogDescription>
            Send the prescription to {patientName} via WhatsApp or Email.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="whatsapp" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">
                  {patientPhone ? `Phone: ${patientPhone}` : 'No phone number on file'}
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Direct WhatsApp share with patient number */}
              {whatsappPhone && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    window.open(
                      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(shareMessage)}`,
                      '_blank'
                    );
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send to Patient
                </Button>
              )}

              {/* Generic WhatsApp share */}
              <WhatsappShareButton
                url={pdfUrl}
                title={shareMessage}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <WhatsappIcon size={20} round className="mr-2" />
                  Share to Any
                </Button>
              </WhatsappShareButton>
            </div>

            <p className="text-xs text-muted-foreground">
              Opens WhatsApp with the prescription link ready to send.
            </p>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleEmailSend}
              disabled={sending || sent}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email with PDF
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Sends an email with the prescription PDF attached.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
