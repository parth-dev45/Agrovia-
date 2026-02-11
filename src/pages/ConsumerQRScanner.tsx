import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Scan, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout';

export default function ConsumerQRScanner() {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrCodeRegionId = "consumer-qr-reader";

    useEffect(() => {
        startScanner();
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        try {
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
                    handleScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // ignore frames without QR code
                }
            );

            setIsScanning(true);
            setPermissionError(false);
        } catch (err) {
            console.error("Error starting scanner:", err);
            setPermissionError(true);
            toast.error("Failed to access camera. Please check permissions.");
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

    const handleScanSuccess = (decodedText: string) => {
        stopScanner();

        // Check if it's a full URL or just an ID
        let batchId = decodedText;

        // Try to extract batch ID if it's a URL
        if (decodedText.includes('/scan/')) {
            const parts = decodedText.split('/scan/');
            if (parts.length > 1) {
                batchId = parts[1];
            }
        }

        // Basic cleaning/validation
        batchId = batchId.trim().toUpperCase();

        // Redirect to the scan result page
        toast.success("Product found! Loading details...");
        navigate(`/scan/${batchId}`);
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="flex flex-col w-full max-w-lg aspect-square bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 ring-1 ring-black/5 mx-auto">
                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/customer')}
                            className="text-white hover:bg-white/20 rounded-full h-10 w-10 backdrop-blur-md bg-black/20"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="text-white font-medium flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg">
                            <Scan className="h-4 w-4 text-primary animate-pulse" />
                            <span className="tracking-wide text-sm">Scan Product</span>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Camera Viewport */}
                    <div className="flex-1 flex flex-col items-center justify-center relative bg-zinc-900 p-6">
                        <div id={qrCodeRegionId} className="w-full h-full absolute inset-0 object-cover" />

                        {/* Overlay Content */}
                        <div className="relative z-10 flex flex-col items-center justify-between h-full py-8 pointer-events-none w-full">
                            {/* Top Text */}
                            <div className="mt-12 text-center">
                                <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 inline-flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-white/90 text-sm font-medium">Camera Active</span>
                                </div>
                            </div>

                            {/* Guide Frame */}
                            <div className="relative">
                                <div className="w-64 h-64 border-2 border-primary/50 rounded-[2rem] shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center relative backdrop-blur-[1px]">
                                    <div className="absolute inset-0 border-2 border-primary rounded-[2rem] animate-pulse opacity-40"></div>

                                    {/* Corner markers */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary -translate-x-1 -translate-y-1 rounded-tl-2xl"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary translate-x-1 -translate-y-1 rounded-tr-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary -translate-x-1 translate-y-1 rounded-bl-2xl"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary translate-x-1 translate-y-1 rounded-br-2xl"></div>
                                </div>

                                {!isScanning && !permissionError && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                                        <Scan className="h-10 w-10 text-primary/50 mx-auto mb-2 animate-bounce" />
                                        <p className="text-white/80 text-sm font-medium animate-pulse">Initializing...</p>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Text */}
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-bold text-white drop-shadow-xl">Scan AgroVia Code</h2>
                                <p className="text-white/70 text-xs max-w-[200px] mx-auto drop-shadow-md">
                                    Center the QR code within the frame to view journey.
                                </p>
                            </div>
                        </div>

                        {permissionError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-30">
                                <div className="text-center p-6 max-w-sm">
                                    <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="h-8 w-8 text-destructive" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
                                    <p className="text-gray-400 mb-6 text-sm">Please allow camera access to scan product codes.</p>
                                    <Button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-full">
                                        Retry Access
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
