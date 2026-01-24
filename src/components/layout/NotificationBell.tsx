import { Bell, Check, Info, AlertTriangle, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export function NotificationBell() {
    const { data: notifications, isLoading } = useNotifications();
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();
    const navigate = useNavigate();

    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    const getIcon = (type: string) => {
        switch (type) {
            case 'payment': return <CreditCard className="w-4 h-4 text-emerald-500" />;
            case 'dispute': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'inquiry': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-slate-500" />;
        }
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) {
            markRead.mutate(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 btn-secondary rounded-xl">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-rose-500 text-white border-2 border-slate-900 text-[10px] font-bold">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border-border bg-card shadow-2xl overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <h3 className="font-black text-sm uppercase tracking-wider">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 px-2"
                            onClick={() => markAllRead.mutate()}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {isLoading ? (
                        <div className="p-10 text-center text-xs text-muted-foreground font-medium italic">Loading notifications...</div>
                    ) : notifications?.length === 0 ? (
                        <div className="p-10 text-center text-xs text-muted-foreground font-medium italic">No new notifications</div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications?.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    className={`p-4 cursor-pointer focus:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${!n.is_read ? 'bg-primary/5' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-xs font-black truncate ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                                                <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <Button
                    variant="ghost"
                    className="w-full h-12 rounded-none text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted"
                    onClick={() => navigate("/settings")} // Or a dedicated notifications page if created
                >
                    View Notification Settings
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
