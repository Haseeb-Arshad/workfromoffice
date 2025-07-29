import { Building2, Coffee, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu";
import { Button } from "@/presentation/components/ui/button";
import { useAtom } from "jotai";
import { userStatusAtom, statusConfigs, type UserStatus } from "@/application/atoms/userStatusAtom";
import { playSound } from "@/infrastructure/lib/utils";

// Icon components mapping
const IconComponents = {
  Building2,
  Coffee,
  User,
};

export const StatusDropdown = () => {
  const [currentStatus, setCurrentStatus] = useAtom(userStatusAtom);
  const currentStatusConfig = statusConfigs[currentStatus];
  const CurrentIcon = IconComponents[currentStatusConfig.icon as keyof typeof IconComponents];

  const handleStatusChange = (newStatus: UserStatus) => {
    playSound("/sounds/click.mp3");
    setCurrentStatus(newStatus);
  };

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
              className={isActive ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{config.label}</span>
              {isActive && <span className="ml-auto text-xs">●</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
