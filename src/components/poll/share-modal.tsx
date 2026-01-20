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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ShareModalProps {
	poll: any
	isOpen: boolean
	onClose: () => void
}

function OrDivider() {
	return (
		<div className='relative flex items-center py-3'>
			<div className='grow border-t border-muted-foreground/20' />
			<span className='mx-4 shrink text-xs font-medium uppercase text-muted-foreground'>
				or
			</span>
			<div className='grow border-t border-muted-foreground/20' />
		</div>
	)
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
			<DialogContent className='glass-strong sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col'>
				<DialogHeader>
					<DialogTitle>Share Poll</DialogTitle>
					<DialogDescription>Share this poll with others</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col overflow-y-auto pr-2'>
					{/* Link Section */}
					<div className='space-y-3'>
						<div className='flex items-center gap-2 text-sm font-medium'>
							<Link2 className='h-4 w-4' />
							Copy Link
						</div>
						<div className='flex gap-2'>
							<Input value={pollUrl} readOnly className='glass' />
							<Button
								variant='outline'
								size='icon'
								onClick={() => copyToClipboard(pollUrl, 'link')}
							>
								{copiedLink ? (
									<Check className='h-4 w-4 text-green-500' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</Button>
						</div>
						{typeof navigator !== 'undefined' && 'share' in navigator && (
							<Button
								variant='outline'
								className='w-full'
								onClick={handleNativeShare}
							>
								Share via...
							</Button>
						)}
					</div>

					<OrDivider />

					{/* QR Code Section */}
					<div className='space-y-3'>
						<div className='flex items-center gap-2 text-sm font-medium'>
							<QrCodeIcon className='h-4 w-4' />
							QR Code
						</div>
						<div className='flex flex-col items-center space-y-3'>
							<div className='rounded-lg bg-white p-3'>
								<QRCode value={pollUrl} size={140} level='H' />
							</div>
							<p className='text-center text-sm text-muted-foreground'>
								Scan to view poll
							</p>
						</div>
					</div>

					{/* Embed Section */}
					{poll.allowEmbed && (
						<>
							<OrDivider />
							<div className='space-y-3'>
								<div className='flex items-center gap-2 text-sm font-medium'>
									<Code className='h-4 w-4' />
									Embed Code
								</div>
								<p className='text-sm text-muted-foreground'>
									Copy this code to embed the poll on your website
								</p>
								<div className='relative'>
									<pre className='glass overflow-x-auto rounded-lg p-4 text-xs'>
										<code>{embedCode}</code>
									</pre>
									<Button
										variant='ghost'
										size='icon'
										className='absolute right-2 top-2'
										onClick={() => copyToClipboard(embedCode, 'embed')}
									>
										{copiedEmbed ? (
											<Check className='h-4 w-4 text-green-500' />
										) : (
											<Copy className='h-4 w-4' />
										)}
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
