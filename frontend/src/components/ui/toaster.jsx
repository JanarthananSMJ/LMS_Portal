import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, Info, XCircle } from "lucide-react"

const variantIcon = {
  success: { Icon: CheckCircle2, className: "text-emerald-500" },
  destructive: { Icon: XCircle, className: "text-destructive" },
  default: { Icon: Info, className: "text-primary" },
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const { Icon, className } = variantIcon[variant] || variantIcon.default;

        return (
          (<Toast key={id} variant={variant} {...props}>
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} />
            <div className="grid flex-1 gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
