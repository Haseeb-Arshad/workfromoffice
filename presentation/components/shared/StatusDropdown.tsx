import { Briefcase, Coffee, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu";

export const StatusDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Briefcase />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Briefcase className="mr-2 h-4 w-4" />
          <span>Work</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Coffee className="mr-2 h-4 w-4" />
          <span>Break</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Away</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
