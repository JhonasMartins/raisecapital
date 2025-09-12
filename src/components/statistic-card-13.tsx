import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pin, Settings, Share2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatisticCard13({
  className,
  total = 30,
  passing = 20,
  title = 'Compliance Checks',
  icon,
  leftTotal = 16,
  leftSuffix = 'checks passing',
  rightSuffix = 'assigned',
}: {
  className?: string;
  total?: number;
  passing?: number;
  title?: string;
  icon?: ReactNode;
  leftTotal?: number;
  leftSuffix?: string;
  rightSuffix?: string;
}) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="border-0 min-h-auto py-5">
        <CardTitle className="flex items-center gap-2.5">
          {icon ? icon : <ShieldCheck className="w-5 h-5 text-primary" />}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </CardTitle>
        <CardToolbar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem>
                <Settings />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TriangleAlert /> Export Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin /> Configure Alerts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 /> Run Manual Check
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShieldCheck /> View History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {/* Progress Bar */}
        <div className="flex grow gap-1">
          {[...Array(total)].map((_, i) => (
            <span
              key={i}
              className={cn(
                `inline-block w-3 h-4 rounded-sm border transition-colors`,
                i < passing ? 'bg-primary border-primary' : 'bg-muted border-muted',
              )}
            />
          ))}
        </div>

        {/* Passing Checks */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>{passing}/{leftTotal} {leftSuffix}</span>
          <span className="font-semibold text-foreground">{Math.round((passing / total) * 100)}% {rightSuffix}</span>
        </div>
      </CardContent>
    </Card>
  );
}
