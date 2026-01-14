import { useState } from 'react'
import { Copy, Check, Link2, QrCode as QrCodeIcon, Code } from 'lucide-react'
import QRCode from 'react-qr-code'
import { getConfig } from '@/utils/config'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ShareModalProps {
	poll: any
	isOpen: boolean
	onClose: () => void
}

export function ShareModal({ poll, isOpen, onClose }: ShareModalProps) {
	const [copiedLink, setCopiedLink] = useState(false)
	const [copiedEmbed, setCopiedEmbed] = useState(false)
	const config = getConfig()
	const pollUrl = `${config.appUrl}/poll/${poll.slug}`
	const embedCode = `<iframe src="${config.appUrl}/embed/${poll.slug}" width="100%" height="600" frameborder="0"></iframe>`

	const copyToClipboard = async (text: string, type: 'link' | 'embed') => {
		try {
			await navigator.clipboard.writeText(text)
			if (type === 'link') {
				setCopiedLink(true)
				setTimeout(() => setCopiedLink(false), 2000)
			} else {
				setCopiedEmbed(true)
				setTimeout(() => setCopiedEmbed(false), 2000)
			}
			toast.success('Copied to clipboard!')
		} catch (error) {
			toast.error('Failed to copy')
		}
	}

	const handleNativeShare = async () => {
		if (typeof navigator !== 'undefined' && 'share' in navigator) {
			try {
				await navigator.share({
					title: poll.title,
					text: poll.description || 'Vote on this poll!',
					url: pollUrl,
				})
			} catch (error) {
				// User cancelled or share failed
			}
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="glass-strong sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Share Poll</DialogTitle>
					<DialogDescription>Share this poll with others</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="link" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="link">
							<Link2 className="mr-2 h-4 w-4" />
							Link
						</TabsTrigger>
						<TabsTrigger value="qr">
							<QrCodeIcon className="mr-2 h-4 w-4" />
							QR Code
						</TabsTrigger>
						{poll.allow_embed && (
							<TabsTrigger value="embed">
								<Code className="mr-2 h-4 w-4" />
								Embed
							</TabsTrigger>
						)}
					</TabsList>

					{/* Link Tab */}
					<TabsContent value="link" className="space-y-4">
						<div className="flex gap-2">
							<Input value={pollUrl} readOnly className="glass" />
							<Button
								variant="outline"
								size="icon"
								onClick={() => copyToClipboard(pollUrl, 'link')}
							>
								{copiedLink ? (
									<Check className="h-4 w-4 text-green-500" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						{typeof navigator !== 'undefined' && 'share' in navigator && (
							<Button variant="outline" className="w-full" onClick={handleNativeShare}>
								Share via...
							</Button>
						)}
					</TabsContent>

					{/* QR Code Tab */}
					<TabsContent value="qr" className="flex flex-col items-center space-y-4">
						<div className="rounded-lg bg-white p-4">
							<QRCode value={pollUrl} size={200} level="H" />
						</div>
						<p className="text-center text-sm text-muted-foreground">
							Scan to view poll
						</p>
					</TabsContent>

					{/* Embed Tab */}
					{poll.allow_embed && (
						<TabsContent value="embed" className="space-y-4">
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									Copy this code to embed the poll on your website
								</p>
								<div className="relative">
									<pre className="glass overflow-x-auto rounded-lg p-4 text-xs">
										<code>{embedCode}</code>
									</pre>
									<Button
										variant="ghost"
										size="icon"
										className="absolute right-2 top-2"
										onClick={() => copyToClipboard(embedCode, 'embed')}
									>
										{copiedEmbed ? (
											<Check className="h-4 w-4 text-green-500" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</TabsContent>
					)}
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
