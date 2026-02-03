"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

type QrCodeDialogProps = {
  hiveId: string;
  hiveName: string;
};

export default function QrCodeDialog({ hiveId, hiveName }: QrCodeDialogProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setQrCodeDataUrl(null); // Reset on open
      const url = `${window.location.origin}/hive/${hiveId}`;
      QRCode.toDataURL(url, { width: 256, margin: 2 }, (err, url) => {
        if (err) {
          console.error(err);
          setQrCodeDataUrl(null);
        } else {
          setQrCodeDataUrl(url);
        }
      });
    }
  }, [open, hiveId]);

  const handlePrint = () => {
    if (!qrCodeDataUrl) return;

    const windowContent = `
      <html>
        <head><title>Print QR Code for ${hiveName}</title></head>
        <body style="text-align: center; padding-top: 2rem; font-family: sans-serif;">
          <h2>${hiveName}</h2>
          <img src="${qrCodeDataUrl}" style="width: 80vw; max-width: 400px;" />
          <script>
            window.onload = () => {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;
    const printWin = window.open('', '', 'width=600,height=600');
    printWin?.document.write(windowContent);
    printWin?.document.close();
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 h-4 w-4" />
          QR Kód
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Kód: {hiveName}</DialogTitle>
          <DialogDescription>
            Nyomtasd ki ezt a QR kódot, és ragaszd a kaptárra a gyors azonosításhoz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4 h-[256px]">
          {qrCodeDataUrl ? (
            <Image src={qrCodeDataUrl} alt={`QR Code for ${hiveName}`} width={256} height={256} />
          ) : (
            <Skeleton className="w-[256px] h-[256px] rounded-md" />
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Bezárás
          </Button>
          <Button onClick={handlePrint} disabled={!qrCodeDataUrl}>Nyomtatás</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
