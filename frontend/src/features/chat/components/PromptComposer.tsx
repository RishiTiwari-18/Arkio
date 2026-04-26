import * as React from "react"
import { Paperclip, SendHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type PromptComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void | Promise<void>
  onAttachClick?: () => void
  onAttachmentDrop?: (file: File) => void
  onRemoveAttachment?: () => void
  attachmentPreview?: string | null
  placeholder?: string
  disabled?: boolean
  sending?: boolean
  className?: string
  maxHeight?: number
  sendLabel?: string
  attachLabel?: string
}

const PromptComposer = ({
  value,
  onChange,
  onSend,
  onAttachClick,
  onAttachmentDrop,
  onRemoveAttachment,
  attachmentPreview,
  placeholder = "Ask me anything...",
  disabled = false,
  sending = false,
  className,
  maxHeight = 180,
  sendLabel = "Send prompt",
  attachLabel = "Attach image",
}: PromptComposerProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const dragDepthRef = React.useRef(0)

  React.useEffect(() => {
    const element = textareaRef.current

    if (!element) return

    element.style.height = "0px"
    const nextHeight = Math.min(element.scrollHeight, maxHeight)
    element.style.height = `${nextHeight}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [value, maxHeight])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!onAttachmentDrop) return
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!onAttachmentDrop) return
    event.preventDefault()
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!onAttachmentDrop) return
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!onAttachmentDrop) return
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      onAttachmentDrop(file)
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-card p-4 shadow-lg transition",
        onAttachmentDrop && isDragging && "border-primary bg-accent/30",
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {onAttachmentDrop && isDragging && (
        <div className="mb-3 rounded-md border border-dashed border-primary/80 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
          Drop image to attach
        </div>
      )}

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || sending}
        placeholder={placeholder}
        className="min-h-8 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
      />

      {attachmentPreview && (
        <div className="mt-3 inline-block overflow-hidden rounded-lg border border-input bg-background p-1">
          <div className="relative">
            <img
              src={attachmentPreview}
              alt="Pending attachment"
              className="h-16 w-16 rounded object-cover"
            />
            {onRemoveAttachment && (
              <button
                type="button"
                onClick={onRemoveAttachment}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Remove attachment"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 ">
        <div className="flex items-center gap-2">
          {onAttachClick && (
            <Button
              variant="ghost"
              type="button"
              onClick={onAttachClick}
              aria-label={attachLabel}
              className=""
            >
              <Paperclip className="size-4" />
            </Button>
          )}
          <p className="text-xs text-muted-foreground max-lg:hidden">Press Enter to send, Shift+Enter for a new line</p>
        </div>

        <Button
          onClick={onSend}
          className="h-10 rounded-lg px-4"
          size="icon-lg"
          aria-label={sendLabel}
          disabled={sending || disabled || !value.trim() && !attachmentPreview}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default PromptComposer