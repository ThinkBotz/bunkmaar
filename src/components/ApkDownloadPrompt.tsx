import { useEffect, useState } from "react";
import { Download, Smartphone, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const APK_URL = "/BunkMaar.apk";
const DISMISS_KEY = "bunkmaar-apk-prompt-dismissed";

export function ApkDownloadPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "true";
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-left sm:text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Smartphone className="h-4 w-4" />
            Android APK available
          </div>
          <DialogTitle>Install BunkMaar on your phone</DialogTitle>
          <DialogDescription className="text-base leading-6">
            Download the APK from this site, then open it on Android to install the app.
            The file is hosted directly on the production website for easy access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-2xl border bg-muted/40 p-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">BunkMaar.apk</p>
              <p className="text-muted-foreground">Tap download, then install from your Downloads folder.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-background/80 p-3 text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              If Android asks for permission to install apps from this browser, enable it once and continue the install.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button asChild className="w-full sm:w-auto">
            <a href={APK_URL} download="BunkMaar.apk">
              <Download className="h-4 w-4" />
              Download APK
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}