import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRightLeft,
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Tags,
    Users,
    Wallet,
    MessagesSquare,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
    // User
    dashboard, 
    userWallets, 
    userCategories, 
    userTransactions,

    // Admin
    adminDashboard, 
    adminUsers,
    adminMessages
} from '@/routes';
import type { NavItem } from '@/types';


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: adminUsers(),
        icon: Users,
    },
    {
        title: 'Messages',
        href: adminMessages(),
        icon: MessagesSquare,
    }
];

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Wallets',
        href: userWallets(),
        icon: Wallet,
    },
    {
        title: 'Categories',
        href: userCategories(),
        icon: Tags,
    },
    {
        title: 'Transactions',
        href: userTransactions(),
        icon: ArrowRightLeft,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    const mainNavItems =
        auth.user?.role === 'admin' ? adminNavItems : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}