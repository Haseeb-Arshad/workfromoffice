import { Building2, Coffee, User, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu";
import { Button } from "@/presentation/components/ui/button";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { userStatusAtom, statusConfigs, type UserStatus } from "@/application/atoms/userStatusAtom";
import { playSound } from "@/infrastructure/lib/utils";

// Icon components mapping
const IconComponents = {
  Building2,
  Coffee,
  User,
};

export const StatusDropdown = () => {
  const [mounted, setMounted] = useState(false);
  const [currentStatus, setCurrentStatus] = useAtom(userStatusAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStatusConfig = statusConfigs[currentStatus];
  const CurrentIcon = IconComponents[currentStatusConfig.icon as keyof typeof IconComponents];

  const handleStatusChange = (newStatus: UserStatus) => {
    playSound("/sounds/click.mp3");
    setCurrentStatus(newStatus);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-7 opacity-0">
        <Building2 size={14} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" title={`Status: ${currentStatusConfig.label}`}>
          <CurrentIcon size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusConfigs).map(([status, config]) => {
          const Icon = IconComponents[config.icon as keyof typeof IconComponents];
          const isActive = status === currentStatus;

          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status as UserStatus)}
              className={isActive ? "bg-accent/50 focus:bg-accent/70" : ""}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="h-4 w-4" />
                <span className="flex-1">{config.label}</span>
                {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
