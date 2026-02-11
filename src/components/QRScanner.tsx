import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
    open: boolean;
    onClose: () => void;
    onScan: (decodedText: string) => void;
}

export function QRScanner({ open, onClose, onScan }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrCodeRegionId = "qr-reader";

    useEffect(() => {
        if (open && !isScanning) {
            startScanner();
        }

        return () => {
            stopScanner();
        };
    }, [open]);

    const startScanner = async () => {
        // Wait for the element to be in the DOM
        const checkElement = () => {
            return new Promise<void>((resolve, reject) => {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    const element = document.getElementById(qrCodeRegionId);
                    if (element) {
                        clearInterval(interval);
                        resolve();
                    } else if (attempts > 10) { // 1 second timeout
                        clearInterval(interval);
                        reject(new Error("Scanner element not found in DOM"));
                    }
                }, 100);
            });
        };

        try {
            await checkElement();

            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(qrCodeRegionId);
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            await scannerRef.current.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    // Success callback
                    onScan(decodedText);
                    stopScanner();
                    onClose();
                },
                (errorMessage) => {
                    // Error callback - we can ignore these as they happen frequently during scanning
                    // console.log(errorMessage);
                }
            );

            setIsScanning(true);
        } catch (err) {
            console.error("Error starting scanner:", err);
            toast.error("Failed to start camera. Please check permissions.");
            onClose();
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    const handleClose = () => {
        stopScanner();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Scan QR Code
                    </DialogTitle>
                    <DialogDescription>
                        Position the QR code within the frame to scan
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <div
                        id={qrCodeRegionId}
                        className="rounded-lg overflow-hidden border-2 border-primary/20"
                    />

                    {!isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 rounded-lg">
                            <div className="text-center space-y-2">
                                <Camera className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                                <p className="text-sm text-muted-foreground">Initializing camera...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
