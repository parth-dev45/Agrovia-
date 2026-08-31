
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Book, Mail, Info, MessageCircle, FileText, Github } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface HelpDialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function HelpDialog({ children, open: controlledOpen, onOpenChange: setControlledOpen }: HelpDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && !isControlled && (
                <DialogTrigger asChild>{children}</DialogTrigger>
            )}
            {/* If controlled, the parent handles the trigger click separately */}
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Help & Support
                    </DialogTitle>
                    <DialogDescription>
                        Find answers, documentation, and support for AgroVia.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="faq" className="h-full flex flex-col">
                        <div className="px-6 pt-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="faq" className="gap-2">
                                    <Book className="h-4 w-4" /> FAQ
                                </TabsTrigger>
                                <TabsTrigger value="contact" className="gap-2">
                                    <Mail className="h-4 w-4" /> Contact
                                </TabsTrigger>
                                <TabsTrigger value="about" className="gap-2">
                                    <Info className="h-4 w-4" /> About
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <TabsContent value="faq" className="mt-0">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>How do I add a new batch?</AccordionTrigger>
                                                <AccordionContent>
                                                    Go to the <strong>Product Management</strong> (Farmer View) page. Fill out the Farmer Intake form with the farmer's details, product type, and quantity. Upon submission, a Batch ID and QR code will be generated.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>How does the Quality Grading work?</AccordionTrigger>
                                                <AccordionContent>
                                                    Navigate to <strong>Quality Reports</strong>. Enter the Batch ID to retrieve its details. You can then input the quality parameters (Visual, Size, etc.) and the system will assign a Grade (A, B, or C) based on your inputs.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>Can I edit a batch after creation?</AccordionTrigger>
                                                <AccordionContent>
                                                    Currently, batch details are immutable to ensure traceability integrity. If you made a mistake, please contact your supervisor or create a new batch and mark the old one as "Rejected" in the warehouse.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>How do I restore my data?</AccordionTrigger>
                                                <AccordionContent>
                                                    Go to <strong>Settings</strong> &gt; <strong>Data Management</strong>. Click on "Restore Data" and select your previously downloaded backup JSON file. The application will reload with your restored data.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Documentation</h3>
                                        <div className="grid gap-2">
                                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                <div className="flex flex-col items-start">
                                                    <span>User Manual (PDF)</span>
                                                    <span className="text-xs text-muted-foreground">Detailed guide for all roles</span>
                                                </div>
                                            </Button>
                                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                                                <FileText className="h-4 w-4 text-green-500" />
                                                <div className="flex flex-col items-start">
                                                    <span>Standard Operating Procedures</span>
                                                    <span className="text-xs text-muted-foreground">Quality & Warehouse guidelines</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="mt-0">
                                <div className="space-y-6">
                                    <div className="text-center py-6">
                                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageCircle className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Need more help?</h3>
                                        <p className="text-muted-foreground">Our support team is available 24/7.</p>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="p-4 rounded-lg border bg-card">
                                            <h4 className="font-medium mb-1">Technical Support</h4>
                                            <p className="text-sm text-muted-foreground mb-3">For bugs, errors, and system issues.</p>
                                            <Button className="w-full gap-2">
                                                <Mail className="h-4 w-4" /> support@agrovia.com
                                            </Button>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-card">
                                            <h4 className="font-medium mb-1">Operations Team</h4>
                                            <p className="text-sm text-muted-foreground mb-3">For urgent operational inquiries.</p>
                                            <Button variant="outline" className="w-full gap-2">
                                                <Mail className="h-4 w-4" /> operations@agrovia.com
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="about" className="mt-0">
                                <div className="flex flex-col items-center text-center space-y-4 py-6">
                                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-2xl">Av</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">AgroVia</h3>
                                        <p className="text-muted-foreground">Supply Chain Management Platform</p>
                                    </div>

                                    <div className="bg-secondary/50 px-4 py-2 rounded-full text-xs font-mono">
                                        v2.1.0 (Production)
                                    </div>

                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        AgroVia connects farmers to retailers through a transparent, efficient, and quality-assured supply chain network.
                                    </p>

                                    <div className="flex gap-4 pt-4">
                                        <a href="https://github.com/topics/agrovia" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Github className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="text-xs text-center text-muted-foreground space-y-1">
                                    <p>&copy; 2026 AgroVia Inc. All rights reserved.</p>
                                    <p>Made with ❤️ for sustainable agriculture.</p>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
