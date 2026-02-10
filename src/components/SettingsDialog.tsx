
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Settings,
    User,
    Palette,
    Database,
    Download,
    Upload,
    Bell,
    Shield,
    LogOut,
    Moon,
    Sun,
    Laptop
} from "lucide-react";
import { createBackup, restoreBackup } from "@/lib/backup";
import { useRef, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

interface SettingsDialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}



// Re-export correctly with proper structure
export function SettingsDialogComputed({ children, open, onOpenChange }: SettingsDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState("Operations User");
    const [email, setEmail] = useState("ops@agrovia.com");

    // Integrated Theme Provider
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (confirm("Are you sure? This will overwrite your current data with the backup.")) {
                restoreBackup(file);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[850px] sm:h-[600px] p-0 gap-0 overflow-hidden bg-background block">
                <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row h-full w-full">

                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-muted/30 border-r flex flex-col h-full shrink-0">
                        <div className="p-6 pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5 mb-0.5" /> Settings
                            </h2>
                        </div>

                        <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 space-y-1 items-stretch">
                            <TabsTrigger
                                value="general"
                                className="w-full justify-start rounded-none border-l-4 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors"
                            >
                                <User className="w-4 h-4 mr-3" /> Profile & Account
                            </TabsTrigger>
                            <TabsTrigger
                                value="appearance"
                                className="w-full justify-start rounded-none border-l-4 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors"
                            >
                                <Palette className="w-4 h-4 mr-3" /> Appearance
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="w-full justify-start rounded-none border-l-4 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors"
                            >
                                <Bell className="w-4 h-4 mr-3" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="data"
                                className="w-full justify-start rounded-none border-l-4 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors"
                            >
                                <Database className="w-4 h-4 mr-3" /> Data Management
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-auto p-6 text-xs text-muted-foreground border-t bg-muted/10">
                            <p>AgroVia v2.1.0</p>
                            <p>Build 2024.10.25</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <ScrollArea className="flex-1 h-full">
                        <div className="p-6 md:p-8 max-w-2xl mx-auto">
                            <TabsContent value="general" className="mt-0 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">Profile</h3>
                                    <p className="text-sm text-muted-foreground">Manage your public profile and account details.</p>
                                </div>
                                <Separator />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarFallback className="bg-primary text-3xl text-primary-foreground">OP</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline">Change Avatar</Button>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" value="Operations Manager" disabled className="bg-muted" />
                                        <p className="text-[0.8rem] text-muted-foreground">Role is managed by your administrator.</p>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={() => toast.success("Profile saved")}>Save Changes</Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="appearance" className="mt-0 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">Appearance</h3>
                                    <p className="text-sm text-muted-foreground">Customize the look and feel of the application.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <Label className="text-base">Theme</Label>
                                        <p className="text-sm text-muted-foreground">Select your preferred color theme.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div
                                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-muted'}`}
                                                onClick={() => handleThemeChange('light')}
                                            >
                                                <Sun className="mb-3 h-6 w-6" />
                                                <span className="text-sm font-medium">Light</span>
                                            </div>
                                            <div
                                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}
                                                onClick={() => handleThemeChange('dark')}
                                            >
                                                <Moon className="mb-3 h-6 w-6" />
                                                <span className="text-sm font-medium">Dark</span>
                                            </div>
                                            <div
                                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'system' ? 'border-primary' : 'border-muted'}`}
                                                onClick={() => handleThemeChange('system')}
                                            >
                                                <Laptop className="mb-3 h-6 w-6" />
                                                <span className="text-sm font-medium">System</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="mt-0 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">Notifications</h3>
                                    <p className="text-sm text-muted-foreground">Configure how you receive alerts.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="alerts" className="flex flex-col space-y-1">
                                            <span>Critical Alerts</span>
                                            <span className="font-normal text-xs text-muted-foreground">Receive notifications for expiring batches</span>
                                        </Label>
                                        <Switch id="alerts" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="emails" className="flex flex-col space-y-1">
                                            <span>Email Digests</span>
                                            <span className="font-normal text-xs text-muted-foreground">Daily summary of operations</span>
                                        </Label>
                                        <Switch id="emails" />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="sound" className="flex flex-col space-y-1">
                                            <span>Sound Effects</span>
                                            <span className="font-normal text-xs text-muted-foreground">Play sounds for success/error actions</span>
                                        </Label>
                                        <Switch id="sound" defaultChecked />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="data" className="mt-0 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">Data Management</h3>
                                    <p className="text-sm text-muted-foreground">Control your local data and backups.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4 bg-muted/40">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium">Export Data</h4>
                                                <p className="text-xs text-muted-foreground">Create a backup of all local application data.</p>
                                            </div>
                                            <Button onClick={createBackup} variant="outline" size="sm">Backup Now</Button>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4 bg-muted/40">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                                <Upload className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium">Import Data</h4>
                                                <p className="text-xs text-muted-foreground">Restore data from a backup file.</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".json"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleRestore}
                                            />
                                            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">Restore</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm">
                                        <Shield className="h-4 w-4 mt-0.5 shrink-0" />
                                        <p>This application runs locally. Clearing your browser cache will remove all data unless you have a backup.</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

// Export the valid component as default or named export
export { SettingsDialogComputed as SettingsDialog };
