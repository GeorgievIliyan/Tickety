import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

type QRCodeDialogProps = {
  content: string;
  type: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const QRCodeDialog = ({
  content,
  type,
  isOpen,
  onOpenChange,
}: QRCodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 text-center">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold capitalize">
            {type} Ticket
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Scan this code at entry to validate your pass.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <QRCodeSVG 
              value={content} 
              size={200}
              level="H" 
              includeMargin={false}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground font-mono truncate max-w-[200px]">
            {content}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;