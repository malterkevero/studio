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

type QrCodeDialogProps = {
  hiveId: string;
  hiveName: string;
};

export default function QrCodeDialog({ hiveId, hiveName }: QrCodeDialogProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open && canvasRef.current) {
      const url = `${window.location.origin}/hive/${hiveId}`;
      QRCode.toCanvas(canvasRef.current, url, { width: 256 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [open, hiveId]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    const windowContent = `
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align: center; padding-top: 2rem;">
          <h2 style="font-family: sans-serif; font-size: 1.5rem;">${hiveName}</h2>
          <img src="${dataUrl}" style="width: 80vw; max-width: 400px;" />
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
        <div className="flex justify-center py-4">
          <canvas ref={canvasRef} />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Bezárás
          </Button>
          <Button onClick={handlePrint}>Nyomtatás</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
