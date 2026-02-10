import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText } from "lucide-react";
import { useState } from "react";
import { HelpDialog } from "./HelpDialog";

interface LegalLinkProps {
    className?: string;
}

export function PrivacyLink({ className }: LegalLinkProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => setOpen(true)}
            >
                Privacy
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Privacy Policy
                        </DialogTitle>
                        <DialogDescription>
                            Last updated: Feb 10, 2026
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 p-4 -mx-4">
                        <div className="space-y-4 px-4 text-sm text-muted-foreground">
                            <p><strong>1. Introduction</strong><br />
                                AgroVia ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our platform.</p>

                            <p><strong>2. Information We Collect</strong><br />
                                We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include your name, email address, phone number, and farm location data.</p>

                            <p><strong>3. How We Use Your Information</strong><br />
                                We use your information to:<br />
                                - Provide, maintain, and improve our services.<br />
                                - Process transactions and send related information.<br />
                                - Send you technical notices, updates, security alerts, and support messages.</p>

                            <p><strong>4. Data Security</strong><br />
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                            <p><strong>5. Contact Us</strong><br />
                                If you have questions about this Privacy Policy, please contact us at privacy@agrovia.com.</p>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function TermsLink({ className }: LegalLinkProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => setOpen(true)}
            >
                Terms
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Terms of Service
                        </DialogTitle>
                        <DialogDescription>
                            Last updated: Feb 10, 2026
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 p-4 -mx-4">
                        <div className="space-y-4 px-4 text-sm text-muted-foreground">
                            <p><strong>1. Acceptance of Terms</strong><br />
                                By accessing or using AgroVia, you agree to be bound by these Terms of Service.</p>

                            <p><strong>2. User Accounts</strong><br />
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

                            <p><strong>3. Acceptable Use</strong><br />
                                You agree not to modify, adapt, or hack the Service or modify another website so as to falsely imply that it is associated with the Service.</p>

                            <p><strong>4. Product Quality & Traceability</strong><br />
                                Farmers and warehouses are responsible for the accuracy of produce quality data entered into the system. Falsifying quality grades may result in account termination.</p>

                            <p><strong>5. Termination</strong><br />
                                We reserve the right to suspend or terminate your account at any time for violation of these terms.</p>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function HelpLink({ className }: LegalLinkProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => setOpen(true)}
            >
                Support
            </button>
            <HelpDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
