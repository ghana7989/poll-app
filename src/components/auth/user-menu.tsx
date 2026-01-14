import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function UserMenu() {
	const { user, signOut } = useAuth()
	const navigate = useNavigate()

	if (!user) return null

	const handleSignOut = async () => {
		await signOut()
		navigate('/')
	}

	const initials = user.user_metadata?.full_name
		?.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase() || user.email?.[0].toUpperCase() || '?'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={user.user_metadata?.avatar_url}
							alt={user.user_metadata?.full_name || 'User'}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.user_metadata?.full_name || 'User'}
						</p>
						<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => navigate('/dashboard')}>
					<UserIcon className="mr-2 h-4 w-4" />
					<span>Dashboard</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => navigate('/settings')}>
					<Settings className="mr-2 h-4 w-4" />
					<span>Settings</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
